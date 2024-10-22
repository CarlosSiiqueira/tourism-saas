import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IReserva, IReservaDTO, IReservaResponse } from "../interfaces/Reserva"
import { IIndex, IReservaFilter } from "../interfaces/Helper"
import crypto from 'crypto'

class ReservaRepository implements IReserva {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IReservaResponse[] }> => {

    const where = {
      excluida: false
    }

    let filterOR: IReservaFilter[] = []

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          filterOR.push(
            {
              Usuario: {
                nome: {
                  contains: value,
                  mode: "insensitive"
                }
              }
            }
          )
          break;

        case 'reserva':
          filterOR.push(
            {
              reserva: {
                equals: parseInt(value),
              }
            }
          )
          break;

        case 'status':
          Object.assign(where,
            {
              status: parseInt(value) == 1 ? true : false
            }
          )
          break

      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.reservas.count({ where }),
      this.prisma.reservas.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        select: {
          id: true,
          reserva: true,
          status: true,
          codigoUsuario: true,
          idExcursao: true,
          dataCadastro: true,
          desconto: true,
          plataforma: true,
          criancasColo: true,
          Pessoa: {
            select: {
              id: true,
              nome: true,
              cpf: true,
              rg: true,
              email: true
            }
          },
          Excursao: {
            select: {
              id: true,
              nome: true,
              dataInicio: true,
              dataFim: true,
              valor: true
            }
          },
          Usuario: {
            select: {
              nome: true
            }
          },
          LocalEmbarque: {
            select: {
              id: true,
              nome: true,
              horaEmbarque: true
            }
          },
          Transacoes: {
            select: {
              id: true,
              valor: true,
              FormaPagamento: {
                select: {
                  id: true,
                  nome: true
                }
              },
              ContaBancaria: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          },
          Opcionais: {
            select: {
              id: true,
              qtd: true,
              Produto: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          },
          ExcursaoPassageiros: {
            include: {
              Pessoa: true,
              LocalEmbarque: true
            }
          }
        },
        where
      })
    ])

    return { count, rows }

  }

  create = async ({
    codigoUsuario,
    passageiros,
    idExcursao,
    desconto,
    plataforma = 1,
    localEmbarqueId,
    criancasColo }: IReservaDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.reservas.create({
        data: {
          id,
          codigoUsuario,
          idExcursao,
          desconto,
          plataforma,
          localEmbarqueId,
          criancasColo,
          Pessoa: {
            connect: passageiros.map(codigoPassageiro => ({ id: codigoPassageiro }))
          }
        }
      })

      return id
    } catch (error) {
      throw new Warning("Erro ao inserir reserva", 400)
    }
  }

  find = async (id: string): Promise<IReservaResponse> => {

    const reserva = await this.prisma.reservas.findUnique({
      where: {
        id
      },
      include: {
        Pessoa: true,
        Excursao: true,
        Usuario: true,
        LocalEmbarque: true,
        Transacoes: {
          include: {
            FormaPagamento: true
          }
        },
        Opcionais: {
          include: {
            Produto: true
          }
        },
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        }
      }
    })

    if (!reserva) {
      throw new Warning("Reserva não encontrada", 400);
    }

    return reserva
  }

  findAll = async (): Promise<IReservaResponse[]> => {

    const reservas = await this.prisma.reservas.findMany({
      include: {
        Pessoa: true,
        Excursao: true,
        Usuario: true,
        Transacoes: {
          include: {
            FormaPagamento: true,
            ContaBancaria: true
          }
        },
        LocalEmbarque: true,
        Opcionais: {
          include: {
            Produto: true
          }
        },
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        }
      }
    })

    if (!reservas) {
      throw new Warning("Sem reservas cadastradas na base", 400)
    }

    return reservas
  }

  delete = async (id: string): Promise<string> => {

    const reserva = await this.prisma.reservas.update({
      where: {
        id: id
      },
      data: {
        excluida: true
      }
    })

    if (!reserva) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id
  }

  update = async ({
    reserva,
    codigoUsuario,
    passageiros,
    idExcursao,
    desconto,
    plataforma,
    criancasColo }: IReservaDTO, id: string): Promise<string[]> => {

    await this.prisma.reservas.update({
      where: {
        id
      },
      data: {
        Pessoa: {
          set: []
        }
      }
    })

    const reservas = await this.prisma.reservas.update({
      data: {
        reserva,
        codigoUsuario,
        idExcursao,
        desconto,
        plataforma,
        criancasColo,
        Pessoa: {
          connect: passageiros.map((codigoPassageiro) => { return { id: codigoPassageiro } })
        }
      },
      where: {
        id: id
      }
    })

    if (!reservas) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Reserva Atualizada com sucesso'];
  }

  setConfirm = async (id: string, status: boolean): Promise<string> => {

    const reserva = await this.prisma.reservas.update({
      where: {
        id,
      },
      data: {
        status
      }
    })

    return id
  }

  setOpcionais = async (opcionais: string[], id: string): Promise<string[]> => {

    const reserva = await this.prisma.reservas.update({
      where: {
        id
      },
      data: {
        Opcionais: {
          connect: opcionais.map((opt) => { return { id: opt } })
        }
      }
    })

    if (!reserva) {
      throw new Warning("Registro não encontrado", 400)
    }

    return ['Opcionais adicionados à reserva']
  }
}

export { ReservaRepository }

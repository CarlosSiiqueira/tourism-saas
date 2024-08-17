import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IReserva, IReservaDTO, IReservaResponse } from "../interfaces/Reserva"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto'

class ReservaRepository implements IReserva {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IReservaResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          Object.assign(where, {
            OR: [
              {
                nome: {
                  contains: value,
                  mode: "insensitive"
                }
              },
              {
                Usuarios: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              }
            ]
          })
          break;

        case 'saldo':
          Object.assign(where, {
            OR: [
              {
                saldo: {
                  equals: parseInt(value),
                  // mode: "insensitive"
                }
              }
            ]
          })
          break;
      }
    })

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
          Pessoa: {
            select: {
              id: true,
              nome: true,
              cpf: true,
              rg: true
            }
          },
          Excursao: {
            select: {
              id: true,
              nome: true,
              dataInicio: true,
              dataFim: true
            }
          },
          Usuario: {
            select: {
              nome: true
            }
          },
          LocalEmbarque: {
            select: {
              nome: true,
              horaEmbarque: true
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
    localEmbarqueId }: IReservaDTO): Promise<string> => {

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

    const Reserva = await this.prisma.reservas.findUnique({
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
        }
      }
    })

    if (!Reserva) {
      throw new Warning("Reserva não encontrada", 400);
    }

    return Reserva
  }

  findAll = async (): Promise<IReservaResponse[]> => {

    const contasBancarias = await this.prisma.reservas.findMany({
      include: {
        Pessoa: true,
        Excursao: true,
        Usuario: true,
        Transacoes: true,
        LocalEmbarque: true
      }
    })

    if (!contasBancarias) {
      throw new Warning("Sem reservas cadastradas na base", 400)
    }

    return contasBancarias
  }

  delete = async (id: string): Promise<string> => {

    const Reserva = await this.prisma.reservas.delete({
      where: {
        id: id
      }
    })

    if (!Reserva) {
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
    plataforma }: IReservaDTO, id: string): Promise<string[]> => {

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

    const Reserva = await this.prisma.reservas.update({
      data: {
        reserva,
        codigoUsuario,
        idExcursao,
        desconto,
        plataforma,
        Pessoa: {
          connect: passageiros.map((codigoPassageiro) => { return { id: codigoPassageiro } })
        }
      },
      where: {
        id: id
      }
    })

    if (!Reserva) {
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
}

export { ReservaRepository }

import prismaManager from "../database/database"
import { Warning } from "../errors"
import {
  IExcursaoPassageiros,
  IExcursaoPassageirosDTO,
  IExcursaoPassageirosResponse,
  IExcursaoPassageirosListResponse,
  IExcursaoPassageirosEmbarqueReponse
} from "../interfaces/ExcursaoPassageiros"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto'

class ExcursaoPassageirosRepository implements IExcursaoPassageiros {

  private prisma = prismaManager.getPrisma()

  index = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex,
    idExcursao: string): Promise<{ count: number, rows: IExcursaoPassageirosResponse[] }> => {

    const where = {
      idExcursao: idExcursao
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          Object.assign(where, {
            OR: [
              {
                Pessoas: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                LocalEmbarque: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }

                }
              }
            ]
          })
          break;

        case 'localEmbarque':
          Object.assign(where, {
            localEmbarque: value
          })
          break;

        case 'idReserva':
          Object.assign(where, {
            AND: [{
              reserva: value
            }]
          })
          break;

        case 'opcional':
          Object.assign(where, {
            Reservas: {
              Opcionais: {
                every: {
                  Produto: {
                    id: value
                  }
                }
              }
            }
          })
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.excursaoPassageiros.count({ where }),
      this.prisma.excursaoPassageiros.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Pessoa: true,
          LocalEmbarque: true,
          Excursao: true,
          Onibus: true,
          Reservas: {
            include: {
              Opcionais: {
                include: {
                  Produto: true
                }
              }
            }
          }
        }
      })
    ])

    const excursaoPassageirosWithEmbarcou = await Promise.all(
      rows.map(async (ep) => {
        const passageiroEmbarque = await this.prisma.passageiroEmbarque.findFirst({
          where: {
            codigoExcursao: ep.idExcursao,
            codigoPassageiro: ep.id,
          },
          select: {
            id: true,
            embarcou: true,
            horaEmbarque: true
          },
        });

        return {
          ...ep,
          embarcou: passageiroEmbarque?.embarcou || false,
          hasBoarded: passageiroEmbarque?.id || '',
          horaEmbarque: passageiroEmbarque?.horaEmbarque || ''
        };
      })
    );


    return { count, rows: excursaoPassageirosWithEmbarcou }
  }

  create = async ({
    idExcursao,
    idPassageiro,
    localEmbarque,
    reserva
  }: IExcursaoPassageirosDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const excursaoPassageiros = await this.prisma.excursaoPassageiros.create({
        data: {
          id,
          idExcursao,
          idPassageiro,
          localEmbarque,
          reserva
        }
      })

      return ['Passageiro registrado na excursão com sucesso']
    } catch (error) {
      throw new Warning("Houve um erro ao incluir passageiro na excursão", 400)
    }
  }

  find = async (idExcursao: string): Promise<IExcursaoPassageirosResponse[]> => {

    const excursaoPassageiros = await this.prisma.excursaoPassageiros.findMany({
      where: {
        idExcursao
      },
      select: {
        id: true,
        idExcursao: true,
        idPassageiro: true,
        localEmbarque: true,
        reserva: true,
        Pessoa: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            sexo: true,
            dataCadastro: true,
            observacoes: true,
            telefone: true,
            telefoneWpp: true,
            email: true,
            contato: true,
            telefoneContato: true,
            ativo: true,
            dataNascimento: true,
            usuarioCadastro: true,
            rankingClientesId: true,
            rg: true,
            emissor: true
          }
        },
        LocalEmbarque: {
          select: {
            nome: true,
            observacoes: true,
            horaEmbarque: true,
            dataCadastro: true,
            codigoEndereco: true,
            usuarioCadastro: true,
            ativo: true
          }
        },
        Excursao: {
          select: {
            nome: true,
            dataInicio: true,
            dataFim: true,
            observacoes: true,
            dataCadastro: true,
            ativo: true,
            gerouFinanceiro: true,
            vagas: true,
            codigoPacote: true,
            usuarioCadastro: true
          }
        },
        Reservas: {
          select: {
            id: true,
            reserva: true,
            status: true,
            codigoUsuario: true,
            desconto: true,
            plataforma: true,
            Opcionais: {
              select: {
                id: true,
                qtd: true,
                idReserva: true,
                Produto: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!excursaoPassageiros) {
      throw new Warning("Excursao vazia", 400)
    }

    return excursaoPassageiros;

  }

  findAll = async (): Promise<IExcursaoPassageirosResponse[]> => {

    const excursaoPassageiros = await this.prisma.excursaoPassageiros.findMany({
      select: {
        id: true,
        idExcursao: true,
        idPassageiro: true,
        localEmbarque: true,
        reserva: true,
        Pessoa: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            sexo: true,
            dataCadastro: true,
            observacoes: true,
            telefone: true,
            telefoneWpp: true,
            email: true,
            contato: true,
            telefoneContato: true,
            ativo: true,
            dataNascimento: true,
            usuarioCadastro: true
          }
        },
        LocalEmbarque: {
          select: {
            nome: true,
            observacoes: true,
            horaEmbarque: true,
            dataCadastro: true,
            codigoEndereco: true,
            usuarioCadastro: true,
            ativo: true
          }
        },
        Excursao: {
          select: {
            nome: true,
            dataInicio: true,
            dataFim: true,
            observacoes: true,
            dataCadastro: true,
            ativo: true,
            gerouFinanceiro: true,
            vagas: true,
            codigoPacote: true,
            usuarioCadastro: true
          }
        },
        Reservas: {
          select: {
            id: true,
            reserva: true,
            status: true,
            codigoUsuario: true,
            desconto: true,
            plataforma: true,
            Opcionais: {
              select: {
                id: true,
                qtd: true,
                idReserva: true,
                Produto: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!excursaoPassageiros) {
      throw new Warning("Excursao vazia", 400)
    }

    return excursaoPassageiros;
  }

  listPassageiros = async (idExcursao: string): Promise<IExcursaoPassageirosListResponse[]> => {

    const excursaoPassageiros = await this.prisma.excursaoPassageiros.findMany({
      where: {
        idExcursao
      },
      select: {
        id: true,
        Reservas: {
          select: {
            reserva: true
          }
        },
        Pessoa: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    if (!excursaoPassageiros) {
      throw new Warning("Excursao vazia", 400)
    }

    const response = excursaoPassageiros.map((passageiro) => {
      return { id: passageiro.id, Pessoa: { ...passageiro.Pessoa }, 'reserva': passageiro.Reservas.reserva }
    })

    return response;
  }

  findByIdPessoa = async (idsPassageiros: string[], idExcursao: string): Promise<IExcursaoPassageirosResponse[]> => {

    const passageiros = await this.prisma.excursaoPassageiros.findMany({
      where: {
        idPassageiro: {
          in: idsPassageiros
        },
        idExcursao: idExcursao
      },
      select: {
        id: true,
        idExcursao: true,
        idPassageiro: true,
        localEmbarque: true,
        reserva: true,
        Pessoa: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            sexo: true,
            dataCadastro: true,
            observacoes: true,
            telefone: true,
            telefoneWpp: true,
            email: true,
            contato: true,
            telefoneContato: true,
            ativo: true,
            dataNascimento: true,
            usuarioCadastro: true
          }
        },
        LocalEmbarque: {
          select: {
            nome: true,
            observacoes: true,
            horaEmbarque: true,
            dataCadastro: true,
            codigoEndereco: true,
            usuarioCadastro: true,
            ativo: true
          }
        },
        Excursao: {
          select: {
            nome: true,
            dataInicio: true,
            dataFim: true,
            observacoes: true,
            dataCadastro: true,
            ativo: true,
            gerouFinanceiro: true,
            vagas: true,
            codigoPacote: true,
            usuarioCadastro: true
          }
        },
        Reservas: {
          select: {
            id: true,
            reserva: true,
            status: true,
            codigoUsuario: true,
            desconto: true,
            plataforma: true,
            Opcionais: {
              select: {
                id: true,
                qtd: true,
                idReserva: true,
                Produto: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return passageiros
  }

  delete = async (idPassageiro: string, idExcursao: string): Promise<string[]> => {

    try {
      const id = await this.prisma.excursaoPassageiros.findFirst({
        where: {
          idExcursao,
          idPassageiro
        }
      })

      if (id) {
        const excursaoPassageiros = await this.prisma.excursaoPassageiros.delete({
          where: {
            id: id.id
          }
        })
      }

      return ['Passageiro Excluido com sucesso']
    } catch (error) {
      throw new Warning("Houve um erro ao realizar exclusao de passageiro", 400)
    }
  }

  deleteMultiple = async (idPassageiros: Array<string>, idExcursao: string): Promise<string[]> => {

    try {

      await this.prisma.excursaoPassageiros.deleteMany({
        where: {
          idPassageiro: {
            in: idPassageiros
          },
          idExcursao: idExcursao
        }
      })

      return ['Passageiro Excluido com sucesso']
    } catch (error) {
      throw new Warning("Houve um erro ao realizar exclusao de passageiro", 400)
    }
  }

  countTripsByPassenger = async (idPessoa: string): Promise<number> => {

    const count = await this.prisma.excursaoPassageiros.count({
      where: {
        Pessoa: {
          id: idPessoa
        },
        Excursao: {
          concluida: true
        }
      }
    })

    return count
  }
}

export { ExcursaoPassageirosRepository }

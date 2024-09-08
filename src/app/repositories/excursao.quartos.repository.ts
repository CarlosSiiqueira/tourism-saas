import prismaManager from "../database/database"
import { IExcursaoQuartos, IExcursaoQuartosDTO, IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos"
import { Warning } from "../errors"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto'

class ExcursaoQuartosRepository implements IExcursaoQuartos {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IExcursaoQuartosResponse[] }> => {

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
                Passageiros: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              }
            ]
          })
          break;

        case 'idTipoQuarto':
          Object.assign(where, {
            OR: [
              {
                TipoQuarto: {
                  id: value
                }
              }
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.excursaoQuartos.count({ where }),
      this.prisma.excursaoQuartos.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        select: {
          id: true,
          numeroQuarto: true,
          dataCadastro: true,
          codigoExcursao: true,
          usuarioCadastro: true,
          Passageiros: {
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
          },
          TipoQuarto: {
            select: {
              id: true,
              nome: true
            }
          },
          Excursao: {
            select: {
              id: true,
              nome: true,
              dataInicio: true,
              dataFim: true,
              observacoes: true,
              dataCadastro: true,
              ativo: true,
              gerouFinanceiro: true,
              vagas: true,
              codigoPacote: true,
              usuarioCadastro: true,
              valor: true,
            }
          }
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    numeroQuarto,
    codigoExcursao,
    passageiros,
    idTipoQuarto,
    usuarioCadastro
  }: IExcursaoQuartosDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const excursaoQuartos = await this.prisma.excursaoQuartos.create({
        data: {
          id: id,
          numeroQuarto: numeroQuarto,
          codigoExcursao: codigoExcursao,
          usuarioCadastro: usuarioCadastro,
          idTipoQuarto: idTipoQuarto,
          Passageiros: {
            connect: passageiros.map(codigoPassageiro => ({ id: codigoPassageiro }))
          }
        }
      })


      return ['Quartos definidos com sucesso']
    } catch (error) {
      throw new Warning('Erro ao inserir quarto')
    }
  }

  find = async (idExcursao: string): Promise<IExcursaoQuartosResponse[]> => {

    const excursaoQuartos = await this.prisma.excursaoQuartos.findMany({
      where: {
        codigoExcursao: idExcursao
      },
      select: {
        id: true,
        numeroQuarto: true,
        dataCadastro: true,
        codigoExcursao: true,
        Passageiros: {
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
        },
        usuarioCadastro: true,
        Excursao: true,
        TipoQuarto: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    if (!excursaoQuartos) {
      throw new Warning('não existem quartos definidos para essa excursao', 400)
    }

    return excursaoQuartos
  }

  findPassageirosWithRoom = async (idExcursao: string): Promise<IExcursaoQuartosResponse[]> => {

    const passageiros = await this.prisma.excursaoQuartos.findMany({
      where: {
        codigoExcursao: idExcursao
      },
      select: {
        id: true,
        numeroQuarto: true,
        dataCadastro: true,
        codigoExcursao: true,
        usuarioCadastro: true,
        Passageiros: {
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
        },
        TipoQuarto: {
          select: {
            id: true,
            nome: true
          }
        },
        Excursao: {
          select: {
            id: true,
            nome: true,
            dataInicio: true,
            dataFim: true,
            observacoes: true,
            dataCadastro: true,
            ativo: true,
            gerouFinanceiro: true,
            vagas: true,
            codigoPacote: true,
            usuarioCadastro: true,
            valor: true,
          }
        }
      }
    })

    if (!passageiros) {
      throw new Warning('Sem passageiros na excursão não encontrado', 400)
    }

    return passageiros;
  }

  update = async ({
    numeroQuarto,
    idTipoQuarto,
    passageiros,
    usuarioCadastro }: IExcursaoQuartosDTO, id: string): Promise<string[]> => {

    await this.prisma.excursaoQuartos.update({
      where: {
        id
      },
      data: {
        Passageiros: {
          set: []
        }
      }
    })

    const excursaoQuartos = await this.prisma.excursaoQuartos.update({
      data: {
        numeroQuarto: numeroQuarto,
        dataCadastro: new Date(),
        usuarioCadastro: usuarioCadastro,
        idTipoQuarto: idTipoQuarto,
        Passageiros: {
          connect: passageiros.map(codigoPassageiro => ({ id: codigoPassageiro }))
        }
      },
      where: {
        id: id
      }
    })

    if (!excursaoQuartos) {
      throw new Warning('registro não encontrado', 400)
    }

    return ['Registro atualizado com sucesso']
  }

  delete = async (id: string): Promise<string[]> => {

    const excursaoQuartos = await this.prisma.excursaoQuartos.delete({
      where: {
        id
      }
    })

    if (!excursaoQuartos) {
      throw new Warning('Não foi possível excluir', 400)
    }

    return ['Quarto excluído com sucesso']
  }

  deleteManyByIdPassageiro = async (idPassageiros: string[], idExcursao: string): Promise<string[]> => {

    try {
      await this.prisma.excursaoQuartos.deleteMany({
        where: {
          codigoExcursao: idExcursao,
          Passageiros: {
            every: {
              Pessoa: {
                id: {
                  in: idPassageiros
                }
              }
            }
          }
        }
      })

      return ['Passageiros removidos do quarto com sucesso']
    } catch (error) {
      return ['Erro ao remover passageiro']
    }
  }
}

export { ExcursaoQuartosRepository }

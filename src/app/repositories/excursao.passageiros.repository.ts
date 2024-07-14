import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IExcursaoPassageiros, IExcursaoPassageirosDTO, IExcursaoPassageirosResponse } from "../interfaces/ExcursaoPassageiros"
import { IIndex } from "../interfaces/Helper"

class ExcursaoPassageirosRepository implements IExcursaoPassageiros {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IExcursaoPassageirosResponse[] }> => {

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
          LocalEmbarque: true
        }
      })
    ])

    return { count, rows }
  }

  create = async (data: IExcursaoPassageirosDTO): Promise<string[]> => {

    try {

      const excursaoPassageiros = await this.prisma.excursaoPassageiros.create({
        data: {
          ...data
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
      include: {
        Pessoa: true
      }
    })

    if (!excursaoPassageiros) {
      throw new Warning("Excursao vazia", 400)
    }

    return excursaoPassageiros;

  }

  findAll = async (): Promise<IExcursaoPassageirosResponse[]> => {

    const excursaoPassageiros = await this.prisma.excursaoPassageiros.findMany()

    if (!excursaoPassageiros) {
      throw new Warning("Excursao vazia", 400)
    }

    return excursaoPassageiros;
  }

  listPassageiros = async (idExcursao: string): Promise<any> => {

    const excursaoPassageiros = await this.prisma.excursaoPassageiros.findMany({
      where: {
        idExcursao
      },
      select: {
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

    let response = excursaoPassageiros.map((passageiro) => {
      return passageiro.Pessoa
    })

    return response;
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


}

export { ExcursaoPassageirosRepository }

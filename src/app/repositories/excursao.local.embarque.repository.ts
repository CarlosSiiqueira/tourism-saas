import prismaManager from "../database/database";
import { Warning } from "../errors";
import {
  IExcursaoLocalEmbarque,
  IExcursaoLocalEmbarqueDTO,
  IExcursaoLocalEmbarqueResponse
} from "../interfaces/ExcursaoLocalEmbarque";
import { IIndex } from "../interfaces/Helper";
import crypto from 'crypto';

class ExcursaoLocalEmbarqueRepository implements IExcursaoLocalEmbarque {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IExcursaoLocalEmbarqueResponse[] }> => {
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
              },
              {
                SubCategoria: {
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
      this.prisma.excursaoLocalEmbarque.count({ where }),
      this.prisma.excursaoLocalEmbarque.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          LocalEmbarque: true
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    idExcursao,
    localEmbarque
  }: IExcursaoLocalEmbarqueDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const categoria = await this.prisma.excursaoLocalEmbarque.create({
        data: {
          id,
          idExcursao,
          LocalEmbarque: {
            connect: localEmbarque.map(localEmbarqueId => ({ id: localEmbarqueId }))
          }
        }
      })

      return id
    } catch (error) {
      throw new Warning('Não foi possível criar Local Embarque da Excursão', 400)
    }

  }

  find = async (id: string): Promise<IExcursaoLocalEmbarqueResponse | null> => {

    const excursaoLocalEmbarque = await this.prisma.excursaoLocalEmbarque.findUnique({
      where: {
        id
      },
      include: {
        LocalEmbarque: true
      }
    })

    if (!excursaoLocalEmbarque) {
      throw new Warning("Local Embarque da Excursão não encontrado", 400)
    }

    return excursaoLocalEmbarque
  }

  findAll = async (): Promise<IExcursaoLocalEmbarqueResponse[]> => {

    const excursaoLocalEmbarque = await this.prisma.excursaoLocalEmbarque.findMany({
      include: {
        LocalEmbarque: true
      }
    })

    if (!excursaoLocalEmbarque) {
      throw new Warning("Sem Local Embarque para esta excursão na base", 400)
    }

    return excursaoLocalEmbarque
  }

  update = async ({
    idExcursao,
    localEmbarque
  }: IExcursaoLocalEmbarqueDTO, id: string): Promise<IExcursaoLocalEmbarqueResponse> => {

    try {

      await this.prisma.excursaoLocalEmbarque.update({
        where: {
          id
        },
        data: {
          LocalEmbarque: {
            set: []
          }
        }
      })

      const excursaoLocalEmbarque = await this.prisma.excursaoLocalEmbarque.update({
        data: {
          idExcursao,
          LocalEmbarque: {
            connect: localEmbarque.map(localEmbarqueId => ({ id: localEmbarqueId }))
          }
        },
        where: {
          id
        },
        include: {
          LocalEmbarque: true
        }
      })

      if (!excursaoLocalEmbarque) {
        throw new Warning("Local Embarque da Excursão não encontrado", 400)
      }

      return excursaoLocalEmbarque

    } catch (error) {
      throw new Warning('Erro ao atualizar Local Embarque da Excursão', 400)
    }

  }

  delete = async (id: string): Promise<IExcursaoLocalEmbarqueResponse> => {

    const excursaoLocalEmbarque = await this.prisma.excursaoLocalEmbarque.delete({
      where: {
        id
      },
      include: {
        LocalEmbarque: true
      }
    })

    if (!excursaoLocalEmbarque) {
      throw new Warning("Local Embarque da Excursão não encontrado", 400)
    }

    return excursaoLocalEmbarque
  }

}

export { ExcursaoLocalEmbarqueRepository }

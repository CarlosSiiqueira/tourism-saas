import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IOpcionalEmbarque, IOpcionalEmbarqueDTO, IOpcionalEmbarqueResponse } from "../interfaces/OpcionaisEmbarque"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class OpcionaisEmbarqueRepository implements IOpcionalEmbarque {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IOpcionalEmbarqueResponse[] }> => {

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
      this.prisma.opcionaisEmbarque.count({ where }),
      this.prisma.opcionaisEmbarque.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Opcional: true,
          Passageiro: {
            include: {
              Reservas: true
            },

          }
        }
      })
    ])

    return { count, rows }

  }

  create = async ({
    embarcou,
    data,
    idOpcional,
    idPassageiro }: IOpcionalEmbarqueDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.opcionaisEmbarque.create({
        data: {
          id,
          embarcou,
          data,
          idOpcional,
          idPassageiro,
        }
      })

      return id

    } catch (error) {
      throw new Warning('Erro ao registrar embarque', 400)
    }
  }

  find = async (id: string): Promise<IOpcionalEmbarqueResponse> => {

    const opcionalEmbarque = await this.prisma.opcionaisEmbarque.findUnique({
      where: {
        id
      },
      include: {
        Opcional: true,
        Passageiro: {
          include: {
            Reservas: true
          },

        }
      }
    })

    if (!opcionalEmbarque) {
      throw new Warning("Opcional Embarque não encontrada", 400);
    }

    return opcionalEmbarque
  }

  findAll = async (): Promise<IOpcionalEmbarqueResponse[]> => {

    const opcionalEmbarque = await this.prisma.opcionaisEmbarque.findMany({
      include: {
        Opcional: true,
        Passageiro: {
          include: {
            Reservas: true
          },

        }
      }
    })

    if (!opcionalEmbarque) {
      throw new Warning("Sem Opcional Embarque cadastrados na base", 400)
    }

    return opcionalEmbarque
  }

  delete = async (id: string): Promise<IOpcionalEmbarqueResponse> => {

    const opcionalEmbarque = await this.prisma.opcionaisEmbarque.delete({
      where: {
        id: id
      }
    })

    if (!opcionalEmbarque) {
      throw new Warning('Registro não encontrado', 400)
    }

    return opcionalEmbarque
  }

  update = async ({
    embarcou,
    data,
    idOpcional,
    idPassageiro }: IOpcionalEmbarqueDTO, id: string): Promise<IOpcionalEmbarqueResponse> => {

    const opcionalEmbarque = await this.prisma.opcionaisEmbarque.update({
      data: {
        embarcou,
        data,
        idOpcional,
        idPassageiro
      },
      where: {
        id: id
      }
    })

    if (!opcionalEmbarque) {
      throw new Warning('Registro não encontrado', 400)
    }

    return opcionalEmbarque
  }
}

export { OpcionaisEmbarqueRepository }

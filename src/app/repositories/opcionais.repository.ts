import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IOpcionais, IOpcionaisDTO, IOpcionaisResponse } from "../interfaces/Opcionais"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class OpcionaisRepository implements IOpcionais {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IOpcionaisResponse[] }> => {

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
      this.prisma.opcionais.count({ where }),
      this.prisma.opcionais.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where
      })
    ])

    return { count, rows }

  }

  create = async ({
    idReserva,
    idProduto,
    qtd,
    codigoUsuario }: IOpcionaisDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.opcionais.create({
        data: {
          id,
          idReserva,
          idProduto,
          qtd,
          codigoUsuario
        }
      })

      return id
    } catch (error) {
      throw new Warning('Erro ao criar opcional', 400)
    }
  }

  find = async (id: string): Promise<IOpcionaisResponse> => {

    const opcionais = await this.prisma.opcionais.findUnique({
      where: {
        id
      }
    })

    if (!opcionais) {
      throw new Warning("Opcional não encontrada", 400);
    }

    return opcionais
  }

  findAll = async (): Promise<IOpcionaisResponse[]> => {

    const opcionais = await this.prisma.opcionais.findMany()

    if (!opcionais) {
      throw new Warning("Sem opcionais cadastradas na base", 400)
    }

    return opcionais
  }

  delete = async (id: string): Promise<string> => {

    const opcionais = await this.prisma.opcionais.delete({
      where: {
        id: id
      }
    })

    if (!opcionais) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id
  }

  deleteByReservaId = async (idReserva: string): Promise<string> => {

    const opcionais = await this.prisma.opcionais.deleteMany({
      where: {
        idReserva
      }
    })

    if (!opcionais) {
      throw new Warning("Erro ao excluir opcionais", 400)
    }

    return idReserva
  }

  update = async ({
    idReserva,
    idProduto,
    qtd,
    codigoUsuario }: IOpcionaisDTO, id: string): Promise<string[]> => {

    const opcionais = await this.prisma.opcionais.update({
      data: {
        idReserva,
        idProduto,
        qtd,
        codigoUsuario
      },
      where: {
        id: id
      }
    })

    if (!opcionais) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro Atualizado com sucesso'];
  }
}

export { OpcionaisRepository }

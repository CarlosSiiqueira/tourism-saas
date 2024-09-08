import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IIndex } from "../interfaces/Helper"
import { ILocalEmbarque, ILocalEmbarqueDTO, ILocalEmbarqueResponse } from "../interfaces/LocalEmbarque"
import crypto from 'crypto'

class LocalEmbarqueRepository implements ILocalEmbarque {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: ILocalEmbarqueResponse[] }> => {

    const where = {
      ativo: true
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
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.localEmbarque.count({ where }),
      this.prisma.localEmbarque.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Endereco: true,
          Usuarios: {
            select: {
              nome: true
            }
          }
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    observacoes,
    horaEmbarque,
    codigoEndereco,
    usuarioCadastro,
  }: ILocalEmbarqueDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const localEmbarque = await this.prisma.localEmbarque.create({
        data: {
          id,
          nome,
          observacoes: observacoes,
          horaEmbarque,
          codigoEndereco,
          usuarioCadastro
        }
      })

      return id

    } catch (error) {
      throw new Warning('Erro ao inserir LocalEmbarque', 400)
    }
  }

  find = async (id: string): Promise<ILocalEmbarqueResponse | null> => {

    const localEmbarque = await this.prisma.localEmbarque.findFirst({
      where: {
        id
      }
    })

    if (!localEmbarque) {
      throw new Warning("Local de embarque não encontrada", 400)
    }

    return localEmbarque

  }

  findAll = async (): Promise<ILocalEmbarqueResponse[]> => {

    const localEmbarques = await this.prisma.localEmbarque.findMany({
      where: {
        ativo: true
      }
    })

    if (!localEmbarques) {
      throw new Warning("Sem Local de embarques registradas na base", 400)
    }

    return localEmbarques
  }

  update = async ({
    nome,
    observacoes,
    horaEmbarque,
    codigoEndereco,
    usuarioCadastro }: ILocalEmbarqueDTO, id: string): Promise<ILocalEmbarqueResponse> => {

    try {

      const localEmbarque = await this.prisma.localEmbarque.update({
        data: {
          nome,
          observacoes: observacoes || '',
          horaEmbarque,
          dataCadastro: new Date(),
          codigoEndereco,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return localEmbarque

    } catch (error) {
      throw new Warning('Erro ao atualizar LocalEmbarque', 400)
    }
  }

  delete = async (id: string): Promise<ILocalEmbarqueResponse> => {

    const localEmbarque = await this.prisma.localEmbarque.update({
      data: {
        ativo: false
      },
      where: {
        id
      }
    })

    if (!localEmbarque) {
      throw new Warning('Não foi possível excluir o Local de embarque', 400)
    }

    return localEmbarque
  }
}

export { LocalEmbarqueRepository }

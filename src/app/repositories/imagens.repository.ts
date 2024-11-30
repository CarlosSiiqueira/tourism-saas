import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IImagem, IImagemDTO, IImagemResponse } from "../interfaces/Imagem";
import { IIndex } from "../interfaces/Helper";
import crypto from 'crypto';

class ImagensRepository implements IImagem {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IImagemResponse[] }> => {
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
                Usuario: {
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
      this.prisma.imagens.count({ where }),
      this.prisma.imagens.findMany({
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
    nome,
    url,
    userId }: IImagemDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const imagem = await this.prisma.imagens.create({
        data: {
          id,
          nome,
          url,
          userId
        }
      })

      return id
    } catch (error) {
      throw new Warning('Não foi possível criar imagem', 400)
    }

  }

  find = async (id: string): Promise<IImagemResponse | null> => {

    const imagem = await this.prisma.imagens.findUnique({
      where: {
        id
      }
    })

    if (!imagem) {
      throw new Warning("Imagem não encontrada", 400)
    }

    return imagem
  }

  findAll = async (): Promise<IImagemResponse[]> => {

    const imagem = await this.prisma.imagens.findMany()

    if (!imagem) {
      throw new Warning("Sem imagens na base", 400)
    }

    return imagem
  }

  update = async ({
    nome,
    url,
    userId }: IImagemDTO, id: string): Promise<IImagemResponse> => {

    try {

      const imagem = await this.prisma.imagens.update({
        data: {
          nome,
          url,
          userId
        },
        where: {
          id
        }
      })

      if (!imagem) {
        throw new Warning("Imagem não encontrada", 400)
      }

      return imagem

    } catch (error) {
      throw new Warning('Erro ao atualizar imagem', 400)
    }

  }

  delete = async (id: string): Promise<IImagemResponse> => {

    const imagem = await this.prisma.imagens.delete({
      where: {
        id
      }
    })

    if (!imagem) {
      throw new Warning("Imagem não encontrada", 400)
    }

    return imagem
  }

}

export { ImagensRepository }

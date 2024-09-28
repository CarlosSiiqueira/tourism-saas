import prismaManager from "../database/database";
import { Warning } from "../errors";
import { ISubCategoriaTransacao, ISubCategoriaTransacaoDTO, ISubCategoriaTransacaoResponse } from "../interfaces/SubCategoriaTransacao";
import { IIndex } from "../interfaces/Helper";
import crypto from 'crypto'

class SubCategoriaTransacaoRepository implements ISubCategoriaTransacao {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: ISubCategoriaTransacaoResponse[] }> => {
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
                CategoriaTransacao: {
                  every: {
                    nome: {
                      contains: value,
                      mode: "insensitive"
                    }
                  }
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
      this.prisma.subCategoriaTransacao.count({ where }),
      this.prisma.subCategoriaTransacao.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          CategoriaTransacao: true
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    codigoUsuario,
  }: ISubCategoriaTransacaoDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const venda = await this.prisma.subCategoriaTransacao.create({
        data: {
          id,
          nome,
          codigoUsuario
        }
      })

      return id

    } catch (error) {
      throw new Warning('Não foi possível criar Subcategoria', 400)
    }

  }

  find = async (id: string): Promise<ISubCategoriaTransacaoResponse | null> => {

    const subCategoria = await this.prisma.subCategoriaTransacao.findUnique({
      where: {
        id
      }
    })

    if (!subCategoria) {
      throw new Warning("Subcategoria não encontrada", 400)
    }

    return subCategoria
  }

  findAll = async (): Promise<ISubCategoriaTransacaoResponse[]> => {

    const CategoriaTransacao = await this.prisma.subCategoriaTransacao.findMany()

    if (!CategoriaTransacao) {
      throw new Warning("Sem Categoria Transacao na base", 400)
    }

    return CategoriaTransacao
  }

  update = async ({
    nome,
    codigoUsuario,
  }: ISubCategoriaTransacaoDTO, id: string): Promise<ISubCategoriaTransacaoResponse> => {

    try {

      const subCategoriaTransacao = await this.prisma.subCategoriaTransacao.update({
        data: {
          nome,
          codigoUsuario
        },
        where: {
          id
        }
      })

      if (!subCategoriaTransacao) {
        throw new Warning("Subcategoria não encontrada", 400)
      }

      return subCategoriaTransacao
    } catch (error) {
      throw new Warning('Erro ao atualizar subcategoria', 400)
    }
  }

  delete = async (id: string): Promise<ISubCategoriaTransacaoResponse> => {

    const subCategoriaTransacao = await this.prisma.subCategoriaTransacao.delete({
      where: {
        id
      }
    })

    if (!subCategoriaTransacao) {
      throw new Warning("Subcategoria não encontrada", 400)
    }

    return subCategoriaTransacao
  }

}

export { SubCategoriaTransacaoRepository }

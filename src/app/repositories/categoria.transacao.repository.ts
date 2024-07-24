import prismaManager from "../database/database";
import { Warning } from "../errors";
import { ICategoriaTransacao, ICategoriaTransacaoDTO, ICategoriaTransacaoResponse } from "../interfaces/CategoriaTransacao";
import { IIndex } from "../interfaces/Helper";

class CategoriaTransacaoRepository implements ICategoriaTransacao {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: ICategoriaTransacaoResponse[] }> => {
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

      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.categoriaTransacao.count({ where }),
      this.prisma.categoriaTransacao.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    tipo,
    codigoUsuario
  }: ICategoriaTransacaoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const venda = await this.prisma.categoriaTransacao.create({
        data: {
          id,
          nome,
          tipo,
          codigoUsuario
        }
      })

      return ['Venda criada com sucesso']

    } catch (error) {
      throw new Warning('Não foi possível criar venda', 400)
    }

  }

  find = async (id: string): Promise<ICategoriaTransacaoResponse | null> => {

    const venda = await this.prisma.categoriaTransacao.findUnique({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Venda não encontrada", 400)
    }

    return venda
  }

  findAll = async (): Promise<ICategoriaTransacaoResponse[]> => {

    const CategoriaTransacao = await this.prisma.categoriaTransacao.findMany()

    if (!CategoriaTransacao) {
      throw new Warning("Sem CategoriaTransacao na base", 400)
    }

    return CategoriaTransacao
  }

  update = async ({
    nome,
    tipo,
    codigoUsuario
  }: ICategoriaTransacaoDTO, id: string): Promise<string[]> => {

    try {

      const venda = await this.prisma.categoriaTransacao.update({
        data: {
          nome,
          tipo,
          codigoUsuario
        },
        where: {
          id
        }
      })

      if (!venda) {
        throw new Warning("Categoria não encontrada", 400)
      }

      return ['Categoria atualizada com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar categoria', 400)
    }

  }

  delete = async (id: string): Promise<string[]> => {

    const venda = await this.prisma.categoriaTransacao.delete({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Categoria não encontrada", 400)
    }

    return ['Categoria excluída com sucesso']
  }

}

export { CategoriaTransacaoRepository }

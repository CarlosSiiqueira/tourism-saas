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
        include: {
          SubCategoria: true
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    tipo,
    codigoUsuario,
    codigoSubCategoria
  }: ICategoriaTransacaoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const categoria = await this.prisma.categoriaTransacao.create({
        data: {
          id,
          nome,
          tipo,
          codigoUsuario,
          codigoSubCategoria
        }
      })

      return ['Categoria criada com sucesso']

    } catch (error) {
      throw new Warning('Não foi possível criar Categoria', 400)
    }

  }

  find = async (id: string): Promise<ICategoriaTransacaoResponse | null> => {

    const categoria = await this.prisma.categoriaTransacao.findUnique({
      where: {
        id
      },
      include: {
        SubCategoria: true
      }
    })

    if (!categoria) {
      throw new Warning("Categoria não encontrada", 400)
    }

    return categoria
  }

  findAll = async (): Promise<ICategoriaTransacaoResponse[]> => {

    const categoriaTransacao = await this.prisma.categoriaTransacao.findMany({
      include: {
        SubCategoria: true
      }
    })

    if (!categoriaTransacao) {
      throw new Warning("Sem Categoria Transacao na base", 400)
    }

    return categoriaTransacao
  }

  update = async ({
    nome,
    tipo,
    codigoUsuario,
    codigoSubCategoria
  }: ICategoriaTransacaoDTO, id: string): Promise<string[]> => {

    try {

      const venda = await this.prisma.categoriaTransacao.update({
        data: {
          nome,
          tipo,
          codigoUsuario,
          codigoSubCategoria
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

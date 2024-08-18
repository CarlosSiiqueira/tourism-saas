import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IIndex } from "../interfaces/Helper"
import { IProduto, IProdutoDTO, IProdutoResponse } from "../interfaces/Produto"
import crypto from 'crypto'

class ProdutoRepository implements IProduto {

  private prisma = prismaManager.getPrisma()

  index = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex): Promise<{ count: number; rows: IProdutoResponse[] }> => {

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
                Fornecedor: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              }
            ]
          })
          break;

        case 'estoque':
          Object.assign(where, {
            AND: [
              {
                estoque: {
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
      this.prisma.produtos.count({ where }),
      this.prisma.produtos.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        select: {
          id: true,
          nome: true,
          estoque: true,
          dataCompra: true,
          dataCadastro: true,
          ativo: true,
          codigoFornecedor: true,
          usuarioCadastro: true,
          Fornecedor: {
            select: {
              id: true,
              nome: true,
              fantasia: true,
              cnpj: true,
              site: true,
              ativo: true,
              dataCadastro: true,
              observacoes: true,
              telefone: true,
              email: true,
              contato: true,
              telefoneContato: true,
              codigoEndereco: true,
              usuarioCadastro: true
            }
          }
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    estoque,
    dataCompra,
    ativo,
    codigoFornecedor,
    usuarioCadastro }: IProdutoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()
      dataCompra = dataCompra && dateValidate(dataCompra)

      const produto = await this.prisma.produtos.create({
        data: {
          id,
          nome,
          estoque,
          dataCompra,
          ativo,
          codigoFornecedor,
          usuarioCadastro,
          dataCadastro: new Date()
        }
      })

      return ['Produto inserido com sucesso']

    } catch (error) {
      throw new Warning("Erro ao inserir produto", 400)
    }
  }

  find = async (id: string): Promise<IProdutoResponse | null> => {

    const produto = await this.prisma.produtos.findUnique({
      where: {
        id
      },
      include: {
        Fornecedor: true
      }
    })

    if (!produto) {
      throw new Warning("Produto não encontrado", 400)
    }

    return produto

  }

  findAll = async (): Promise<IProdutoResponse[]> => {

    const produtos = await this.prisma.produtos.findMany({
      where: {
        ativo: true
      },
      include: {
        Fornecedor: true
      }
    })

    if (!produtos) {
      throw new Warning("Sem produtos registrados na base", 400)
    }

    return produtos
  }

  update = async ({
    nome,
    estoque,
    dataCompra,
    ativo,
    codigoFornecedor,
    usuarioCadastro }: IProdutoDTO, id: string): Promise<string[]> => {

    try {
      dataCompra = dataCompra && dateValidate(dataCompra)

      const produto = await this.prisma.produtos.update({
        data: {
          nome,
          estoque,
          dataCompra,
          ativo,
          codigoFornecedor,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return ['Produto atualizado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar produto', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    const produto = await this.prisma.produtos.update({
      data: {
        ativo: false
      },
      where: {
        id
      }
    })

    if (!produto) {
      throw new Warning('Não foi possível excluir o produto', 400)
    }

    return ['Produto excluído com sucesso']
  }
}

export { ProdutoRepository }

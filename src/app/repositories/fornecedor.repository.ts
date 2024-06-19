import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IFornecedor, IFornecedorDTO, IFornecedorResponse } from "../interfaces/Fornecedor";
import { IIndex } from "../interfaces/Helper";

class FornecedorRepository implements IFornecedor {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IFornecedorResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
        case 'fantasia':
          Object.assign(where, {
            OR: [
              {
                nome: {
                  contains: value,
                  mode: "insensitive"
                }
              },
              {
                fantasia: {
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

        case 'cnpj':
          Object.assign(where, {
            OR: [
              {
                cnpj: {
                  contains: value,
                  mode: "insensitive"
                }
              }
            ]
          })
          break;

        case 'email':
          Object.assign(where, {
            OR: [
              {
                email: {
                  contains: value,
                  mode: "insensitive"
                }
              }
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.fornecedor.count({ where }),
      this.prisma.fornecedor.findMany({
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
    fantasia,
    cnpj,
    site = '',
    observacoes = '',
    telefone = '',
    email,
    contato = '',
    telefoneContato = '',
    codigoEndereco,
    usuarioCadastro
  }: IFornecedorDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const fornecedor = await this.prisma.fornecedor.create({
        data: {
          id,
          nome,
          fantasia,
          cnpj,
          site,
          observacoes,
          telefone,
          email,
          contato,
          telefoneContato,
          codigoEndereco,
          usuarioCadastro
        }
      })

      return ['Fornecedor incluído com sucesso']

    } catch (error) {
      throw new Warning('Erro ao incluir fornecedor', 400)
    }
  }

  find = async (id: string): Promise<IFornecedorResponse | null> => {

    const fornecedor = await this.prisma.fornecedor.findUnique({
      where: {
        id
      },
      include: {
        Endereco: true,
      }
    })

    if (!fornecedor) {
      throw new Warning("Fornecedor não encontrado", 400)
    }

    return fornecedor
  }

  findAll = async (): Promise<IFornecedorResponse[]> => {

    const fornecedores = await this.prisma.fornecedor.findMany({
      where: {
        ativo: true
      },
      include: {
        Endereco: true,
      }
    })

    if (!fornecedores) {
      throw new Warning("Sem fornecedores cadastrados na base", 400)
    }

    return fornecedores
  }

  update = async ({
    nome,
    fantasia,
    cnpj,
    site,
    observacoes,
    telefone,
    email,
    contato,
    telefoneContato,
    codigoEndereco,
    usuarioCadastro
  }: IFornecedorDTO, id: string): Promise<string[]> => {

    const fornecedor = await this.prisma.fornecedor.update({
      data: {
        nome,
        fantasia,
        cnpj,
        site,
        dataCadastro: new Date(),
        observacoes,
        telefone,
        email,
        contato,
        telefoneContato,
        codigoEndereco,
        usuarioCadastro
      },
      where: {
        id
      }
    })

    if (!fornecedor) {
      throw new Warning("Fornecedor não encontrado", 400)
    }

    return ['Fornecedor atualizado com sucesso']
  }

  delete = async (id: string): Promise<string[]> => {

    const fornecedor = await this.prisma.fornecedor.update({
      data: {
        ativo: false
      },
      where: {
        id
      }
    })

    if (!fornecedor) {
      throw new Warning("Fornecedor não encontrado", 400)
    }

    return ['Fornecedor excluido com sucesso']
  }

}

export { FornecedorRepository }

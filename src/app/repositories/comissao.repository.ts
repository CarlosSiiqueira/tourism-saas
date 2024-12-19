import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IComissao, IComissaoDTO, IComissaoFilter, IComissaoResponse } from "../interfaces/Comissao"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class ComissaoRepository implements IComissao {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IComissaoResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    let filterOR: IComissaoFilter[] = []

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          filterOR.push(
            {
              Usuario: {
                nome: {
                  contains: value,
                  mode: "insensitive"
                }
              }
            }
          )
          break;

        case 'saldo':
          if (value) {
            filterOR.push(
              {
                valor: {
                  equals: parseInt(value)
                }
              }
            )
          }
          break;
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.comissao.count({ where }),
      this.prisma.comissao.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Usuario: true,
          Financeiro: true
        }
      })
    ])

    return { count, rows }

  }

  create = async ({
    periodo,
    valor,
    idTransacao,
    usuariosId
  }: IComissaoDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.comissao.create({
        data: {
          id,
          periodo,
          valor,
          idTransacao,
          usuariosId
        }
      })

      return id

    } catch (error) {
      throw new Warning('Erro ao criar comissão', 400)
    }
  }

  find = async (id: string): Promise<IComissaoResponse> => {

    const comissao = await this.prisma.comissao.findUnique({
      where: {
        id
      },
      include: {
        Usuario: true,
        Financeiro: true
      }
    })

    if (!comissao) {
      throw new Warning("Comissão não encontrada", 400);
    }

    return comissao
  }

  findAll = async (): Promise<IComissaoResponse[]> => {

    const comissoes = await this.prisma.comissao.findMany({
      include: {
        Usuario: true
      }
    })

    if (!comissoes) {
      throw new Warning("Sem comissão cadastradas na base", 400)
    }

    return comissoes
  }

  delete = async (id: string): Promise<IComissaoResponse> => {

    const comissao = await this.prisma.comissao.delete({
      where: {
        id: id
      }
    })

    if (!comissao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return comissao
  }

  update = async ({
    periodo,
    valor,
    idTransacao,
    usuariosId
  }: IComissaoDTO, id: string): Promise<IComissaoResponse> => {

    const comissao = await this.prisma.comissao.update({
      data: {
        periodo,
        valor,
        idTransacao,
        usuariosId
      },
      where: {
        id: id
      }
    })

    if (!comissao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return comissao
  }

  findByFinanceiro = async (idTransacao: string): Promise<IComissaoResponse | null> => {

    const comissao = await this.prisma.comissao.findFirst({
      where: {
        idTransacao
      }
    })

    return comissao;
  }

  setPaid = async (id: string, date: Date): Promise<string> => {

    const comissao = await this.prisma.comissao.update({
      data: {
        pagoEm: date
      },
      where: {
        id: id
      }
    })

    if (!comissao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return 'Pagamento Registrado com sucesso'

  }
}

export { ComissaoRepository }

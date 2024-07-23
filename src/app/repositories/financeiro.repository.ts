import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IFinanceiro, IFinanceiroDTO, IFinanceiroIndexResponse, IFinanceiroResponse } from "../interfaces/Financeiro";
import { IIndex } from "../interfaces/Helper";

class FinanceiroRepository implements IFinanceiro {

  private prisma = prismaManager.getPrisma()

  index = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex): Promise<{ count: number, rows: IFinanceiroIndexResponse[] }> => {

    const where = {
      ativo: true
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          Object.assign(where, {
            OR: [
              {
                Pessoas: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                Fornecedor: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }

                }
              },
              {
                Excursao: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                Produtos: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                FormaPagamento: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
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
              },
              {
                observacao: {
                  contains: value,
                  mode: "insensitive"
                }
              }
            ]
          })
          break;

        case 'valor':
          Object.assign(where, {
            valor: parseFloat(value)
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Pessoas: true,
          Fornecedor: true,
          Excursao: true,
          Pacotes: true,
          Usuarios: true,
          Produtos: true,
          FormaPagamento: {
            include: {
              ContaBancaria: true
            }
          }
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    tipo,
    valor,
    vistoAdmin,
    data,
    efetivado,
    observacao,
    ativo,
    numeroComprovanteBancario,
    dataPrevistaRecebimento,
    idWP,
    codigoPessoa,
    codigoFornecedor,
    codigoExcursao,
    codigoProduto,
    codigoPacote,
    codigoFormaPagamento,
    usuarioCadastro
  }: IFinanceiroDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID();
      data = dateValidate(data)
      dataPrevistaRecebimento = dateValidate(dataPrevistaRecebimento)

      await this.prisma.transacoes.create({
        data: {
          id,
          tipo,
          valor,
          vistoAdmin,
          data,
          efetivado,
          observacao,
          ativo,
          numeroComprovanteBancario,
          dataPrevistaRecebimento,
          idWP,
          codigoPessoa,
          codigoFornecedor,
          codigoExcursao,
          codigoProduto,
          codigoPacote,
          codigoFormaPagamento,
          usuarioCadastro
        }
      })

      return [id]

    } catch (error) {
      throw new Warning('Houve um erro ao gerar transação', 400)
    }

  }

  find = async (id: string): Promise<IFinanceiroResponse | null> => {

    const financeiro = await this.prisma.transacoes.findFirst({
      where: {
        id
      },
      include: {
        Pessoas: true,
        Fornecedor: true,
        Excursao: true,
        Produtos: true,
        Pacotes: true,
        FormaPagamento: true,
        Usuarios: true
      }
    })

    if (!financeiro) {
      throw new Warning("Transação não encontrada", 400)
    }

    return financeiro

  }

  findAll = async (): Promise<IFinanceiroResponse[]> => {

    const financeiros = await this.prisma.transacoes.findMany({
      where: {
        ativo: true
      },
      include: {
        Pessoas: true,
        Fornecedor: true,
        Excursao: true,
        Produtos: true,
        Pacotes: true,
        FormaPagamento: true,
        Usuarios: true
      }
    })

    if (!financeiros) {
      throw new Warning("Não foram encontrados registros na base", 400)
    }

    return financeiros
  }

  update = async ({
    tipo,
    valor,
    vistoAdmin,
    data,
    efetivado,
    observacao,
    ativo,
    numeroComprovanteBancario,
    codigoPessoa,
    codigoFornecedor,
    codigoExcursao,
    codigoProduto,
    codigoPacote,
    codigoFormaPagamento,
    usuarioCadastro
  }: IFinanceiroDTO, id: string): Promise<string[]> => {

    try {

      data = dateValidate(data)
      let dataPrevistaRecebimento = new Date();

      const financeiro = await this.prisma.transacoes.update({
        data: {
          tipo,
          valor,
          vistoAdmin,
          data,
          efetivado,
          observacao,
          ativo,
          numeroComprovanteBancario,
          dataPrevistaRecebimento,
          codigoPessoa,
          codigoFornecedor,
          codigoExcursao,
          codigoProduto,
          codigoPacote,
          codigoFormaPagamento,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return ['Transação atualizada com sucesso']

    } catch (error) {
      throw new Warning('Houve um error ao atualizar transação', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    const financeiro = await this.prisma.transacoes.delete({
      where: {
        id
      }
    })

    if (!financeiro) {
      throw new Warning('Transação não encontrada', 400)
    }

    return [id]
  }

}

export { FinanceiroRepository }

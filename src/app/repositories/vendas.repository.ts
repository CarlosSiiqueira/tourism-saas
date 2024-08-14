import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IVendas, IVendasDTO, IVendasResponse } from "../interfaces/Vendas";
import crypto from 'crypto'

class VendasRepository implements IVendas {

  private prisma = prismaManager.getPrisma()

  create = async ({
    valor,
    tipo,
    qtd,
    origem = 1,
    codigoCliente,
    codigoFormaPagamento,
    codigoProduto = null,
    codigoPacote = null,
    usuarioCadastro
  }: IVendasDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const venda = await this.prisma.vendas.create({
        data: {
          id,
          valor,
          tipo,
          qtd,
          origem,
          codigoCliente,
          codigoFormaPagamento,
          codigoProduto,
          codigoPacote,
          usuarioCadastro
        }
      })

      return ['Venda criada com sucesso']

    } catch (error) {
      throw new Warning('Não foi possível criar venda', 400)
    }

  }

  find = async (id: string): Promise<IVendasResponse | null> => {

    const venda = await this.prisma.vendas.findUnique({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Venda não encontrada", 400)
    }

    return venda
  }

  findAll = async (): Promise<IVendasResponse[]> => {

    const vendas = await this.prisma.vendas.findMany()

    if (!vendas) {
      throw new Warning("Sem vendas na base", 400)
    }

    return vendas
  }

  update = async ({
    valor,
    tipo,
    qtd,
    efetivada,
    codigoCliente,
    codigoFormaPagamento,
    codigoProduto,
    codigoPacote,
    usuarioCadastro
  }: IVendasDTO, id: string): Promise<string[]> => {

    try {

      let data = new Date(Date.now())

      const venda = await this.prisma.vendas.update({
        data: {
          valor,
          tipo,
          qtd,
          efetivada,
          data,
          codigoCliente,
          codigoFormaPagamento,
          codigoProduto,
          codigoPacote,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      if (!venda) {
        throw new Warning("Venda não encontrada", 400)
      }

      return ['Venda atualizada com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar venda', 400)
    }

  }

  delete = async (id: string): Promise<string[]> => {

    const venda = await this.prisma.vendas.delete({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Venda não encontrada", 400)
    }

    return ['Venda excluída com sucesso']
  }

}

export { VendasRepository }

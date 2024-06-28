import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IFinanceiro, IFinanceiroDTO, IFinanceiroResponse } from "../interfaces/Financeiro";

class FinanceiroRepository implements IFinanceiro {

  private prisma = prismaManager.getPrisma()

  create = async ({
    tipo,
    valor,
    vistoAdmin,
    data,
    efetivado,
    observacao = "",
    ativo,
    numeroComprovanteBancario = "",
    dataPrevistaRecebimento,
    codigoPessoa,
    codigoFornecedor,
    codigoExcursao = "",
    codigoProduto = "",
    codigoPacote = "",
    codigoFormaPagamento,
    usuarioCadastro
  }: IFinanceiroDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID();
      data = dateValidate(data)

      const financeiro = await this.prisma.transacoes.create({
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

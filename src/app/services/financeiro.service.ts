import { inject, injectable } from "tsyringe";
import prismaManager from "../database/database"
import { FinanceiroRepository } from "../repositories/financeiro.repository";
import { IFinanceiroDTO } from "../interfaces/Financeiro";

@injectable()
export class FinanceiroService {

  constructor(
    @inject("FinanceiroRepository")
    private financeiroRepository: FinanceiroRepository
  ) { }

  private prisma = prismaManager.getPrisma();

  setVistoAdmin = async (visto: boolean, id: string): Promise<string[]> => {

    const financeiro = await this.prisma.transacoes.update({
      data: {
        vistoAdmin: visto
      },
      where: {
        id: id
      }
    })

    if (!financeiro) {
      return ['Financeiro não encotrado']
    }

    return visto ? ['Financeiro liberado para efetivação'] : ['Financeiro bloqueado para efetivação']

  }

  checkVistoAdmin = async (id: string): Promise<boolean> => {

    const visto = await this.prisma.transacoes.findUnique({
      select: {
        vistoAdmin: true
      },
      where: {
        id
      }
    })

    if (!visto) {
      return false
    }

    return visto.vistoAdmin
  }

  efetivarTransacao = async ({
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
    usuarioCadastro }: IFinanceiroDTO, id: string): Promise<string[]> => {

    const visto = await this.checkVistoAdmin(id)

    if (visto) {
      const financeiro = await this.financeiroRepository.update({
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
      }, id)

      if (financeiro) {
        return ['Financeiro efetivado com sucesso']
      }

      return ["Não foi possível efetivar financeiro"]
    }

    return ['Financeiro não verificado pelo usuário admin, favor solicitar verificação']
  }

  desEfetivar = async (id: string): Promise<string[]> => {

    const financeiro = await this.prisma.transacoes.update({
      data: {
        efetivado: false
      },
      where: {
        id
      }
    })

    if (!financeiro) {
      return ['Não foi possível realizar operação']
    }

    return ['Financeiro liberado para alteração']
  }

}

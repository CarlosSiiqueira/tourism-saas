import { inject, injectable } from "tsyringe";
import { FinanceiroRepository } from "../repositories/financeiro.repository";
import { IFinanceiroDTO } from "../interfaces/Financeiro";
import { wooCommerce } from "../api/woocommerce";
import { IFinanceiroHookArgs } from "../interfaces/Helper";
import { proccessFinanceiroData } from "../../shared/utils/webHookBody";
import { IPacoteResponse } from "../interfaces/Pacote";

@injectable()
export class FinanceiroService {

  constructor(
    @inject("FinanceiroRepository")
    private financeiroRepository: FinanceiroRepository
  ) { }

  setVistoAdmin = async (visto: boolean, id: string): Promise<string[]> => {

    const financeiro = await this.financeiroRepository.setVistoAdmin(visto, id)

    return financeiro
  }

  efetivarTransacao = async (id: string): Promise<boolean> => {

    const visto = await this.financeiroRepository.checkVistoAdmin(id)

    if (visto) {
      const financeiro = await this.financeiroRepository.efetivaDesfetiva(id, true)

      if (financeiro) {
        return true
      }

      return false
    }

    return false
  }

  desEfetivar = async (id: string): Promise<boolean> => {

    const financeiro = await this.financeiroRepository.efetivaDesfetiva(id, false)

    if (!financeiro) {
      return false
    }

    return true
  }

  setDataPrevistaPagamento = async (qtdDiasRecebimento: number): Promise<Date> => {

    let data = new Date()
    data.setDate(data.getDate() + qtdDiasRecebimento)

    return data
  }

  confirmaPagamentoWoo = async (id: string): Promise<void> => {

    const data = {
      status: "completed"
    }

    const financeiro = await this.financeiroRepository.find(id)
    let idWP = financeiro?.idWP

    if (idWP) {
      const woo = await wooCommerce.put(`orders/${idWP}`, data)
    }
  }

  proccessCreateTransaction = async (dados: IFinanceiroHookArgs, pacote: IPacoteResponse[]): Promise<void> => {

    const financeiro = await Promise.all(
      pacote.map(async (pct) => {

        dados.Pacote.id = pct.id
        dados.Pacote.idWP = pct.idWP || 0

        let financeiroData = proccessFinanceiroData(dados)

        const id = await this.financeiroRepository.create(financeiroData);

        return id
      })
    );
  }

  create = async (data: IFinanceiroDTO): Promise<string> => {

    const financeiro = await this.financeiroRepository.create(data)

    return financeiro
  }

}

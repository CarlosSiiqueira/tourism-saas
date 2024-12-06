import { inject, injectable } from "tsyringe";
import { FinanceiroRepository } from "../repositories/financeiro.repository";
import { IFinanceiroDTO, IFinanceiroResponse } from "../interfaces/Financeiro";
import { IFinanceiroHookArgs, IIndex } from "../interfaces/Helper";
import { proccessFinanceiroData } from "../../shared/utils/webHookBody";
import { IPacoteResponse } from "../interfaces/Pacote";

@injectable()
export class FinanceiroService {

  constructor (
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

  relatorioFinanceiroCliente = async (params: IIndex, idCliente: string): Promise<any> => {

    const { sum, count, rows } = await this.financeiroRepository.relatorioFinanceiroCliente(params, idCliente)

    return { sum, count, rows }
  }

  relatorioFinanceiroCategoria = async (params: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }> => {
    return await this.financeiroRepository.relatorioFinanceiroCategoria(params)
  }

  relatorioFinanceiroExcursoes = async (params: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }> => {
    return await this.financeiroRepository.relatorioFinanceiroExcursoes(params)
  }

  relatorioFinanceiroFornecedor = async (params: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], despesas: number }> => {
    return await this.financeiroRepository.relatorioFinanceiroFornecedor(params)
  }

  relatorioFinanceiroPacote = async (params: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], despesas: number }> => {
    return await this.financeiroRepository.relatorioFinanceiroPacote(params)
  }

  relatorioFinanceiroVenda = async (params: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], vendas: number }> => {
    return await this.financeiroRepository.relatorioFinanceiroVenda(params)
  }

  find = async (id: string): Promise<IFinanceiroResponse> => {

    const financeiro = await this.financeiroRepository.find(id)

    return financeiro
  }

  update = async (data: IFinanceiroDTO, id: string): Promise<string> => {

    const financeiro = await this.financeiroRepository.update(data, id)

    return financeiro
  }

  delete = async (id: string): Promise<string> => {

    const financeiro = await this.financeiroRepository.delete(id)

    return financeiro
  }

}

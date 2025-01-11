import { inject, injectable } from "tsyringe";
import { FinanceiroRepository } from "../repositories/financeiro.repository";
import { IFinanceiroDTO, IFinanceiroResponse } from "../interfaces/Financeiro";
import {
  IFinanceiroHookArgs,
  IIndex,
  IPagarmeLinkDTO,
  OpcionalReserva,
  PagarmeLinkItem,
  PagarmeLinkRequestBody
} from "../interfaces/Helper";
import { proccessFinanceiroData } from "../../shared/utils/webHookBody";
import { IPacoteResponse } from "../interfaces/Pacote";
import { pagarme } from "../api/pagarme";
import { IPessoaResponse } from "../interfaces/Pessoa";
import { IExcursaoResponse } from "../interfaces/Excursao";
import { formattingDate } from "../../shared/helper/date";

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

  generatePaymentLink = async (
    data: IPagarmeLinkDTO,
    customer: IPessoaResponse,
    excursao: IExcursaoResponse
  ): Promise<{ id: string, url: string }> => {

    const { opcionais } = data
    const paymentMethod: Array<string> = data.paymentMethods

    const phones = {}
    const pixSettings = { expires_in: 2 }
    const installmentsAmount = excursao.valor >= 2000 ? 10 : 5
    const quantidadeExcursao = data.quantidade
    const country_code = "55"
    const valorTotalExcursao = excursao.valor

    var area_code;
    var number;
    var area_code_mobile;
    var number_mobile;
    var opcionaisItems: PagarmeLinkItem[] = [];
    var valorTotalOpcionais = 0

    if (customer.telefone) {
      area_code = customer.telefone?.slice(0, 2) || '85'
      number = customer?.telefone?.slice(2) || ''
    }

    if (customer.telefoneWpp) {
      area_code_mobile = customer.telefoneWpp?.slice(0, 2) || '85'
      number_mobile = customer?.telefoneWpp?.slice(2) || ''
    }

    if (opcionais.length) {
      opcionaisItems = opcionais.map((opcional: OpcionalReserva) => {
        return {
          amount: Math.round(opcional.valor * 100),
          name: opcional.nome,
          default_quantity: opcional.quantidade,
          description: ''
        }
      })

      opcionaisItems = opcionaisItems.filter((item: PagarmeLinkItem) => !!item)

      valorTotalOpcionais = opcionaisItems.reduce((value: number, opcional: PagarmeLinkItem) => value + (opcional.amount * opcional.default_quantity), 0)
    }

    const requestLink: PagarmeLinkRequestBody = {
      is_building: false,
      payment_settings: {
        credit_card_settings: {
          operation_type: "auth_and_capture",
          installments: Array.from({ length: installmentsAmount }, (_, index) => ({
            number: index + 1,
            total: Math.round((valorTotalExcursao * quantidadeExcursao) * 100) + valorTotalOpcionais,
          })),
        },
        accepted_payment_methods: paymentMethod
      },
      cart_settings: {
        items: [
          {
            amount: Math.round(valorTotalExcursao * 100),
            name: `${formattingDate(excursao.dataInicio.toDateString())} à ${formattingDate(excursao.dataFim.toDateString())} - ${excursao.nome}`,
            description: "",
            default_quantity: quantidadeExcursao
          }
        ]
      },
      name: `${formattingDate(excursao.dataInicio.toDateString())} à ${formattingDate(excursao.dataFim.toDateString())} - ${excursao.nome}`,
      type: "order",
      customer_settings: {
        customer: {
          type: "individual",
          email: customer.email,
          name: customer.nome,
          document: customer.cpf,
          document_type: "CPF",
        }
      },
      layout_settings: {
        image_url: "https://tourism-saas-web-git-main-carlossiiqueiras-projects.vercel.app/images/prados/logo_laranja.png",
        primary_color: "#dd7f11"
      }
    }

    if (area_code && number) {
      Object.assign(phones, {
        home_phone: {
          country_code,
          area_code,
          number
        }

      })
    }

    if (area_code_mobile && number_mobile) {
      Object.assign(phones, {
        mobile_phone: {
          country_code,
          area_code: area_code_mobile,
          number: number_mobile
        }
      })
    }

    if (requestLink.customer_settings.customer && phones) {
      Object.assign(requestLink.customer_settings.customer, {
        phones: {
          ...phones
        }
      });
    }

    if (paymentMethod.includes('pix')) {
      Object.assign(requestLink.payment_settings, {
        pix_settings: {
          ...pixSettings
        }
      })
    }

    if (opcionaisItems.length) {
      requestLink.cart_settings.items = requestLink.cart_settings.items.concat(opcionaisItems)
    }

    const paymentLink = await pagarme.post('/paymentlinks', requestLink)

    return { id: paymentLink.data.id, url: paymentLink.data.url }
  }

}

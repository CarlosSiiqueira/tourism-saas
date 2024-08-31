import { injectable, inject } from "tsyringe";
import { VendasRepository } from "../repositories/vendas.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { FinanceiroService } from "../services/financeiro.service";
import { FormaPagamentoService } from "../services/forma.pagamento.service";

@injectable()
class VendasController {

  constructor(
    @inject("VendasRepository")
    private vendasRepository: VendasRepository,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const res = await this.vendasRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  efetivar = async (request: Request, response: Response): Promise<void> => {

    const venda = await this.vendasRepository.efetivar(request.params.id)

    if (venda) {
      const formaPagamento = await this.formaPagamentoService.find(venda.codigoFormaPagamento)

      request.body.tipo = 2
      request.body.observacao = 'venda efetivada'
      request.body.ativo = true
      request.body.data = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)
      request.body.usuarioCadastro = venda.usuarioCadastro
      request.body.valor = request.body.total
      request.body.codigoExcursao = venda.codigoExcursao
      request.body.codigoProduto = venda.codigoProduto
      request.body.valor = venda.valorTotal
      request.body.codigoFormaPagamento = formaPagamento.id

      const res = await this.financeiroService.create(request.body);
    }

    response.status(200).send(venda)
  }

  desEfetivar = async (request: Request, response: Response): Promise<void> => {

    const venda = await this.vendasRepository.desEfetivar(request.params.id)

    response.status(200).send(venda)
  }


}

export { VendasController }
import { FinanceiroRepository } from '../repositories/financeiro.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { FinanceiroService } from '../services/financeiro.service'
import { FormaPagamentoRepository } from '../repositories/forma.pagamento.repository'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteRepository } from '../repositories/pacote.repository'
import { proccessPacotesId } from '../../shared/utils/webHookBody'
import { IPacoteResponse } from '../interfaces/Pacote'

@injectable()
class FinanceiroController {
  constructor(
    @inject("FinanceiroRepository")
    private financeiroRepository: FinanceiroRepository,
    private financeiroService: FinanceiroService = new FinanceiroService(financeiroRepository),
    @inject("FormaPagamentoRepository")
    private formaPagamentoRepository: FormaPagamentoRepository,
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const res = await this.financeiroRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const formaPagamento = await this.formaPagamentoRepository.find(request.body.formaPagamento)

    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    const res = await this.financeiroRepository.create(request.body)

    response.status(200).send(res)
  }

  createByHook = async (request: Request, response: Response): Promise<void> => {

    const formaPagamento = await this.formaPagamentoRepository.findByName(request.body.payment_method_title)

    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    request.body.tipo = 2
    request.body.valor = parseFloat(request.body.total)
    request.body.vistoAdmin = false
    request.body.efetivado = false
    request.body.observacao = 'teste'
    request.body.ativo = true
    request.body.numeroComprovanteBancario = null
    // request.body.idWP = request.body.transaction_id
    request.body.idWP = 1
    request.body.codigoPessoa = 'fc60d73e-ee47-47dc-a690-810cc43c26c3'
    request.body.codigoFornecedor = null
    request.body.codigoExcursao = '3130555d-17a7-4a29-b7d5-7a33a94bf523'
    request.body.codigoProduto = null
    request.body.codigoPacote = 'b474e52d-c20c-4ceb-adc8-cda42b66c1b8'
    request.body.codigoFormaPagamento = formaPagamento.id
    request.body.codigoContaBancaria = null
    request.body.codigoCategoria = '1'
    request.body.usuarioCadastro = '0692ca23-a6e2-492b-96e8-90dc421ec471'
    request.body.data = new Date()

    const res = await this.financeiroRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  setVistoAdmin = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroService.setVistoAdmin(request.body.visto, request.params.id)

    response.status(200).send(res)
  }

  efetivarTransacao = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroService.efetivarTransacao(request.body, request.params.id)
    await this.financeiroService.confirmaPagamentoWoo(request.params.id)

    response.status(200).send(res)
  }

  desEfetivar = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroService.desEfetivar(request.params.id)

    response.status(200).send(res)
  }

  createFromHook = async (request: Request, response: Response): Promise<void> => {

    const ids = proccessPacotesId(request.body);

    if (ids.length) {
      var pacote = await this.pacoteRepository.getAllByIds(ids);

      if (pacote.length) {
        const res = await this.financeiroService.proccessCreateTransaction(request.body, pacote)

        response.status(200).send(res)
        return;
      }
    }

    response.status(301).send('Pacotes não encontrados')
  }

  clone = async (request: Request, response: Response): Promise<void> => {

    const clonedTransaction = await this.financeiroRepository.find(request.params.id)

    if (clonedTransaction) {
      const id = await this.financeiroRepository.create(clonedTransaction)
      response.status(200).send(id)
      return;
    }

    response.status(301).send('Não foi possivel realizar procedimento')

  }

}

export { FinanceiroController }

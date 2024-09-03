import { ExcursaoRepository } from '../repositories/excursao.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteService } from '../services/pacote.service'
import { PacoteRepository } from '../repositories/pacote.repository'
import { FinanceiroService } from '../services/financeiro.service'
import { FormaPagamentoService } from '../services/forma.pagamento.service'
import { dateValidate } from '../../shared/helper/date'

@injectable()
class ExcursaoController {

  constructor(
    @inject("ExcursaoRepository")
    private excursaoRepository: ExcursaoRepository,
    private pacoteService: PacoteService,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const excursao = await this.excursaoRepository.create(request.body)

    const result = await Promise.all(
      request.body.itensAdicionais.map(async (item: { data: string, valor: number, codigoFormaPagamento: string, idFornecedor: string }) => {

        request.body.tipo = 1
        request.body.ativo = true
        request.body.data = dateValidate(item.data)
        request.body.usuarioCadastro = request.body.usuarioCadastro
        request.body.valor = item.valor
        request.body.codigoExcursao = excursao
        request.body.codigoFormaPagamento = item.codigoFormaPagamento
        request.body.codigoFornecedor = item.idFornecedor 

        const financeiro = await this.financeiroService.create(request.body)
      })
    )

    response.status(200).send(excursao)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.findAll()

    response.status(200).send(res)

  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.delete(request.params.id)

    response.status(200).send(res)

  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  publish = async (request: Request, response: Response): Promise<void> => {

    const excursao = await this.excursaoRepository.publish(request.params.id)

    if (excursao.id) {
      const pacote = await this.pacoteService.find(excursao.codigoPacote)
      const pacoteWP = await this.pacoteService.createEvent(excursao.nome, excursao.dataInicio.toISOString().split('T')[0], excursao.dataFim.toISOString().split('T')[0], excursao.observacoes || '')
      await this.pacoteService.setIdWP(pacote.id, pacoteWP.id)
    }

    response.status(200).send('Excursão publicada com sucesso')
  }

  concluir = async (request: Request, response: Response): Promise<void> => {

    const excursao = await this.excursaoRepository.concluir(request.params.id)

    response.status(200).send('Excursão concluída com sucesso')
  }

}

export { ExcursaoController }

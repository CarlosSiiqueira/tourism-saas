import { ReservaRepository } from '../repositories/reserva.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { formatIndexFilters } from '../../shared/utils/filters'
import { FinanceiroService } from '../services/financeiro.service'
import { FormaPagamentoService } from '../services/forma.pagamento.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'

@injectable()
class ReservaController {
  constructor(
    @inject("ReservaRepository")
    private reservaRepository: ReservaRepository,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService,
    private excursaoPassageiroService: ExcursaoPassageiroService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.reservaRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const reserva = await this.reservaRepository.create(request.body)
    const formaPagamento = await this.formaPagamentoService.find(request.body.codigoFormaPagamento)

    request.body.idReserva = reserva || ''
    request.body.tipo = 2
    request.body.observacao = request.body.criancasColo > 0 ? `${request.body.criancasColo}x nessa Reserva` : ''
    request.body.ativo = true
    request.body.data = new Date()
    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)
    request.body.usuarioCadastro = request.body.codigoUsuario
    request.body.valor = request.body.total

    const financeiro = await this.financeiroService.create(request.body)

    const newPassageiro = await Promise.all(
      request.body.passageiros.map(async (passageiro: string) => {
        return await this.excursaoPassageiroService.create({
          idExcursao: request.body.idExcursao,
          idPassageiro: passageiro,
          localEmbarque: request.body.localEmbarqueId,
          reserva: reserva
        })
      })
    )

    response.status(200).send(reserva)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.reservaRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.reservaRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.reservaRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.reservaRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }
}

export { ReservaController }

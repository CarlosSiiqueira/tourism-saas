import { CreditoClienteRepository } from '../repositories/credito.cliente.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'
import { FinanceiroService } from '../services/financeiro.service'
import { IFinanceiroDTO } from '../interfaces/Financeiro'

@injectable()
class CreditoClienteController {
  constructor(
    @inject("CreditoClienteRepository")
    private creditoClienteRepository: CreditoClienteRepository,
    private logService: LogService,
    private financeiroService: FinanceiroService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.creditoClienteRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.creditoClienteRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Crédito Cliente',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.creditoClienteRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.creditoClienteRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const creditoCliente = await this.creditoClienteRepository.delete(request.params.id)

    if (creditoCliente) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: JSON.stringify(creditoCliente),
        oldData: null,
        rotina: 'Crédito Cliente',
        usuariosId: user.id
      })

      // var financeiro: IFinanceiroDTO = {
      //   idReserva: creditoCliente.idReserva,
      //   tipo: 1,
      //   valor: creditoCliente.valor,
      //   data: new Date(),
      //   ativo: true,
      //   usuarioCadastro: user.id,
      //   codigoFormaPagamento: ''
      // }

      // await this.financeiroService.create(financeiro)
    }

    response.status(200).send(creditoCliente)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const creditoCliente = await this.creditoClienteRepository.update(request.body, request.params.id)

    if (creditoCliente) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: request.params.id, ...request.body }),
        oldData: JSON.stringify(creditoCliente),
        rotina: 'Crédito Cliente',
        usuariosId: user.id
      })
    }

    response.status(200).send(creditoCliente)
  }
}

export { CreditoClienteController }

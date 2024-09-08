import { FormaPagamentoRepository } from '../repositories/forma.pagamento.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'

@injectable()
class FormaPagamentoController {
  constructor(
    @inject("FormaPagamentoRepository")
    private formaPagamentoRepository: FormaPagamentoRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response) => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.formaPagamentoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.formaPagamentoRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify(request.body),
      oldData: '',
      rotina: 'Forma Pagamento',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.formaPagamentoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.formaPagamentoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const formaPagamento = await this.formaPagamentoRepository.find(request.params.id)
    const res = await this.formaPagamentoRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: JSON.stringify(formaPagamento),
      rotina: 'Forma Pagamento',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.formaPagamentoRepository.delete(request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: null,
      oldData: JSON.stringify(res),
      rotina: 'Forma Pagamento',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

}

export { FormaPagamentoController }

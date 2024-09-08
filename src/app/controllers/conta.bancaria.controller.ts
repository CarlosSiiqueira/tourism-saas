import { ContaBancariaRepository } from '../repositories/conta.bancaria.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'

@injectable()
class ContaBancariaController {
  constructor(
    @inject("ContaBancariaRepository")
    private contaBancariaRepository: ContaBancariaRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.contaBancariaRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.contaBancariaRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Conta Bancária',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const contaBancaria = await this.contaBancariaRepository.delete(request.params.id)

    if (contaBancaria) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(contaBancaria),
        rotina: 'Conta Bancária',
        usuariosId: user.id
      })
    }

    response.status(200).send(contaBancaria)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const oldContaBancaria = await this.contaBancariaRepository.find(request.params.id)
    const contaBancaria = await this.contaBancariaRepository.update(request.body, request.params.id)

    if (contaBancaria) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: request.params.id, ...request.body }),
        oldData: JSON.stringify(oldContaBancaria),
        rotina: 'Conta Bancária',
        usuariosId: user.id
      })
    }

    response.status(200).send(contaBancaria)
  }

}

export { ContaBancariaController }

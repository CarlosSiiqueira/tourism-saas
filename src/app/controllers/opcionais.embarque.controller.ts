import { OpcionaisEmbarqueRepository } from '../repositories/opcionais.embarque.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'

@injectable()
class OpcionaisEmbarqueController {
  constructor(
    @inject("OpcionaisEmbarqueRepository")
    private opcionaisEmbarqueRepository: OpcionaisEmbarqueRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.opcionaisEmbarqueRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.opcionaisEmbarqueRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Opcionais Embarque',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.opcionaisEmbarqueRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.opcionaisEmbarqueRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const contaBancaria = await this.opcionaisEmbarqueRepository.delete(request.params.id)

    if (contaBancaria) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(contaBancaria),
        rotina: 'Opcionais Embarque',
        usuariosId: user.id
      })
    }

    response.status(200).send(contaBancaria)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const oldContaBancaria = await this.opcionaisEmbarqueRepository.find(request.params.id)
    const contaBancaria = await this.opcionaisEmbarqueRepository.update(request.body, request.params.id)

    if (contaBancaria) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: request.params.id, ...request.body }),
        oldData: JSON.stringify(oldContaBancaria),
        rotina: 'Opcionais Embarque',
        usuariosId: user.id
      })
    }

    response.status(200).send(contaBancaria)
  }
}

export { OpcionaisEmbarqueController }

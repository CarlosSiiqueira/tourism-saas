import { ExcursaoOnibusRepository } from '../repositories/excursao.onibus.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class ExcursaoOnibusController {
  constructor(
    @inject("ExcursaoOnibusRepository")
    private excursaoOnibusRepository: ExcursaoOnibusRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoOnibusRepository.index(request.params.idExcursao, { orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.find(request.params.idExcursao, request.params.idCadeira)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.findAll(request.params.idExcursao)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.update(request.body, request.params.idExcursao)

    response.status(200).send(res)
  }
}

export { ExcursaoOnibusController }

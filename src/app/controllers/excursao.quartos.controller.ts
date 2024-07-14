import { ExcursaoQuartosRepository } from '../repositories/excursao.quartos.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class ExcursaoQuartosController {
  constructor(
    @inject("ExcursaoQuartosRepository")
    private excursaoQuartosRepository: ExcursaoQuartosRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoQuartosRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoQuartosRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoQuartosRepository.find(request.params.idExcursao)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoQuartosRepository.update(request.body, request.params.idExcursao)

    response.status(200).send(res)
  }
}

export { ExcursaoQuartosController }

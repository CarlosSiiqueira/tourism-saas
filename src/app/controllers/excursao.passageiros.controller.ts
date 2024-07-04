import { ExcursaoPassageirosRepository } from '../repositories/excursao.passageiros.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class ExcursaoPassageirosController {

  constructor(
    @inject("ExcursaoPassageirosRepository")
    private excursaoPassageirosRepository: ExcursaoPassageirosRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoPassageirosRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.findAll()

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.delete(request.params.idPassageiro, request.params.idExcursao)

    response.status(200).send(res)
  }
}

export { ExcursaoPassageirosController }

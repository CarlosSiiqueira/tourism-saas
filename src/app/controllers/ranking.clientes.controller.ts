import { RankingClientesRepository } from '../repositories/ranking.clientes.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class RankingClientesController {
  
  constructor(
    @inject("RankingClientesRepository")
    private rankingClientesRepository: RankingClientesRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.rankingClientesRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.rankingClientesRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.rankingClientesRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.rankingClientesRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.rankingClientesRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.rankingClientesRepository.delete(request.params.id)

    response.status(200).send(res)
  }
}

export { RankingClientesController }

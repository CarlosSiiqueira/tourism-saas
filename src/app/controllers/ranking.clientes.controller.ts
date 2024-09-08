import { RankingClientesRepository } from '../repositories/ranking.clientes.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'

@injectable()
class RankingClientesController {

  constructor(
    @inject("RankingClientesRepository")
    private rankingClientesRepository: RankingClientesRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.rankingClientesRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.rankingClientesRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Ranking Clientes',
      usuariosId: user.id
    })

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

    let user = JSON.parse(request.headers.user as string);

    const oldRanking = await this.rankingClientesRepository.find(request.params.id)
    const ranking = await this.rankingClientesRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(ranking),
      oldData: JSON.stringify(oldRanking),
      rotina: 'Ranking Clientes',
      usuariosId: user.id
    })

    response.status(200).send(ranking)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const ranking = await this.rankingClientesRepository.delete(request.params.id)

    if (ranking) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(ranking),
        rotina: 'Ranking Clientes',
        usuariosId: user.id
      })
    }

    response.status(200).send(ranking)
  }
}

export { RankingClientesController }

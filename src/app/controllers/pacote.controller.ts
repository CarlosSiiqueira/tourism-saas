import { PacoteRepository } from '../repositories/pacote.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteService } from '../services/pacote.service'

@injectable()
class PacoteController {

  constructor(
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository,
    private pacoteService: PacoteService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.pacoteRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    if (request.headers['x-wc-webhook-signature']) {
      request.body = []
    }

    const res = await this.pacoteRepository.create(request.body)

    if (res.success) {
      // const pacoteWP = await this.pacoteService.createProductWp(request.body)
      // await this.pacoteRepository.setIdWP(res.pacote.id, pacoteWP.id)
    }

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.update(request.body, request.params.id)

    if (res.success) {
      // await this.pacoteService.updatePacoteWP(res.pacote)
    }

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  listImagesPacote = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteService.listImagesPacote(request.params.search)

    response.status(200).send(res)
  }
}

export { PacoteController }

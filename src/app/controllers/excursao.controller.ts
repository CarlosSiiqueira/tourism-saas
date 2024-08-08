import { ExcursaoRepository } from '../repositories/excursao.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteService } from '../services/pacote.service'
import { PacoteRepository } from '../repositories/pacote.repository'

@injectable()
class ExcursaoController {

  constructor(
    @inject("ExcursaoRepository")
    private excursaoRepository: ExcursaoRepository,
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository,
    private pacoteService: PacoteService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.findAll()

    response.status(200).send(res)

  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.delete(request.params.id)

    response.status(200).send(res)

  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  publish = async (request: Request, response: Response): Promise<void> => {

    const excursao = await this.excursaoRepository.publish(request.params.id)

    if (excursao.id) {
      const pacote = await this.pacoteRepository.find(excursao.codigoPacote)
      const pacoteWP = await this.pacoteService.createProductWp(request.body)
      await this.pacoteRepository.setIdWP(pacote.id, pacoteWP.id)
    }

    response.status(200).send('Excursão publicada com sucesso')
  }

}

export { ExcursaoController }

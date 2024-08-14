import { ExcursaoPassageirosRepository } from '../repositories/excursao.passageiros.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { ExcursaoService } from '../services/excursao.service'
import { ExcursaoQuartosService } from '../services/excursao.quarto.service'

@injectable()
class ExcursaoPassageirosController {

  constructor(
    @inject("ExcursaoPassageirosRepository")
    private excursaoPassageirosRepository: ExcursaoPassageirosRepository,
    private excursaoService: ExcursaoService,
    private excursaoQuartoService: ExcursaoQuartosService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoPassageirosRepository.index({ orderBy, order, skip, take, filter }, request.params.idExcursao)

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.find(request.params.idExcursao)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.findAll()

    response.status(200).send(res)
  }

  listPassageiros = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.listPassageiros(request.params.idExcursao)

    response.status(200).send(res)
  }

  listPassageirosNoRoom = async (request: Request, response: Response): Promise<void> => {

    const passageiros = await this.excursaoPassageirosRepository.listPassageiros(request.params.idExcursao)
    const quartos = await this.excursaoQuartoService.findPassageirosWithRoom(request.params.idExcursao)
    const res = await this.excursaoService.filterPassageirosWithoutRoom(passageiros, quartos);

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.delete(request.params.idPassageiro, request.params.idExcursao)

    response.status(200).send(res)
  }
}

export { ExcursaoPassageirosController }

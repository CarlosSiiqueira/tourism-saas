import { ExcursaoPassageirosRepository } from '../repositories/excursao.passageiros.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { ExcursaoService } from '../services/excursao.service'
import { ExcursaoQuartosService } from '../services/excursao.quarto.service'
import { ExcursaoOnibusService } from '../services/excursao.onibus.service'
import { OpcionaisService } from '../services/opcionais.service'

@injectable()
class ExcursaoPassageirosController {

  constructor (
    @inject("ExcursaoPassageirosRepository")
    private excursaoPassageirosRepository: ExcursaoPassageirosRepository,
    private excursaoService: ExcursaoService,
    private excursaoQuartoService: ExcursaoQuartosService,
    private excursaoOnibusService: ExcursaoOnibusService,
    private opcionaisService: OpcionaisService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoPassageirosRepository.index({ orderBy, order, skip, take, filter }, request.params.idExcursao)

    const summary = await this.opcionaisService.summary(request.params.idExcursao)

    response.status(200).send({ passageiros: res, summary: summary })
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

    const { idExcursao } = request.params

    const quartos = await this.excursaoQuartoService.findPassageirosWithRoom(idExcursao)
    const passengersWithRoom = quartos.map((room) => { return room.Passageiros.map((passenger) => { return passenger.id }) })
    const passageiros = await this.excursaoPassageirosRepository.listPassengersExcludingSome(idExcursao, passengersWithRoom.flat())

    response.status(200).send(passageiros)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoPassageirosRepository.delete(request.params.idPassageiro, request.params.idExcursao)

    response.status(200).send(res)
  }

  listPassageirosNoChair = async (request: Request, response: Response): Promise<void> => {

    const passageiros = await this.excursaoPassageirosRepository.listPassageiros(request.params.idExcursao)
    const onibus = await this.excursaoOnibusService.findAll(request.params.idExcursao)
    const res = await this.excursaoService.filterPassageirosWithoutChair(passageiros, onibus);

    response.status(200).send(res)
  }
}

export { ExcursaoPassageirosController }

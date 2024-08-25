import { ExcursaoQuartosRepository } from '../repositories/excursao.quartos.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { ExcursaoService } from '../services/excursao.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'
import { ExcursaoQuartosService } from '../services/excursao.quarto.service'

@injectable()
class ExcursaoQuartosController {
  constructor(
    @inject("ExcursaoQuartosRepository")
    private excursaoQuartosRepository: ExcursaoQuartosRepository,
    private excursaoService: ExcursaoService,
    private excursaoPassageiroService: ExcursaoPassageiroService,
    private excursaoQuartoService: ExcursaoQuartosService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoQuartosRepository.index({ orderBy, order, skip, take, filter })

    const summary = await this.excursaoQuartoService.countRoomTypes(res.rows, { orderBy, order, skip, take, filter })

    response.status(200).send({ quartos: res, summary: summary })
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let passageiros = await this.excursaoPassageiroService.findByIdPessoa(request.body.passageiros, request.body.codigoExcursao)

    if (passageiros.length) {
      request.body.passageiros = passageiros.map((passageiro) => {
        return passageiro.id
      })
    }

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

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoQuartosRepository.delete(request.params.id)

    response.status(200).send(res)
  }
}

export { ExcursaoQuartosController }

import { ExcursaoQuartosRepository } from '../repositories/excursao.quartos.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'

@injectable()
class ExcursaoQuartosController {
  constructor(
    @inject("ExcursaoQuartosRepository")
    private excursaoQuartosRepository: ExcursaoQuartosRepository
  ) { }

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

import { ExcursaoOnibusRepository } from '../repositories/excursao.onibus.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'

@injectable()
class ExcursaoOnibusController {
  constructor(
    @inject("ExcursaoOnibusRepository")
    private excursaoOnibusRepository: ExcursaoOnibusRepository
  ) { }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.find(request.params.idExcursao, request.params.idCadeira)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.update(request.body, request.params.idExcursao)

    response.status(200).send(res)
  }
}

export { ExcursaoOnibusController }

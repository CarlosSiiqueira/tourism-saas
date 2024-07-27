import { injectable, inject } from "tsyringe";
import { TipoQuartoRepository } from "../repositories/tipo.quarto.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";

@injectable()
class TipoQuartoController {

  constructor(
    @inject("TipoQuartoRepository")
    private tipoQuartoRepository: TipoQuartoRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.tipoQuartoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.delete(request.params.id)

    response.status(200).send(res)
  }
}

export { TipoQuartoController }
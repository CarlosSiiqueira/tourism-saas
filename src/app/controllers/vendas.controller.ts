import { injectable, inject } from "tsyringe";
import { VendasRepository } from "../repositories/vendas.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";

@injectable()
class VendasController {

  constructor(
    @inject("VendasRepository")
    private vendasRepository: VendasRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const res = await this.vendasRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.delete(request.params.id)

    response.status(200).send(res)
  }


}

export { VendasController }
import { inject, injectable } from "tsyringe";
import { PassageiroEmbarqueRepository } from "../repositories/passageiro.embarque.repository";
import { Request, Response } from 'express'
import { formatIndexFilters } from "../../shared/utils/filters";

@injectable()
class PassageiroEmbarqueController {

  constructor(
    @inject("PassageiroEmbarqueRepository")
    private passageiroEmbarqueRepository: PassageiroEmbarqueRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {
    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.passageiroEmbarqueRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findByExcursao = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.findByExcursao(request.params.idExcursao)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.findAll()

    response.status(200).send(res)
  }

  embarqueDesembarque = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.embarqueDesembarque(request.body)

    response.status(200).send(res)
  }
}

export { PassageiroEmbarqueController }

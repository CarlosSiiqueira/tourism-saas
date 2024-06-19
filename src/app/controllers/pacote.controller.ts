import { PacoteRepository } from '../repositories/pacote.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'

@injectable()
class PacoteController {

  constructor(
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository
  ) { }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.create(request.body)

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

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.delete(request.params.id)

    response.status(200).send(res)
  }


}

export { PacoteController }

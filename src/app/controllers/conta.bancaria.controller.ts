import { ContaBancariaRepository } from '../repositories/conta.bancaria.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"

@injectable()
class ContaBancariaController {
  constructor(
    @inject("ContaBancariaRepository")
    private contaBancariaRepository: ContaBancariaRepository
  ) { }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.create(request.body)

    response.status(200).send(res)

  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.find(request.params.id)

    response.status(200).send(res)

  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.contaBancariaRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

}

export { ContaBancariaController }

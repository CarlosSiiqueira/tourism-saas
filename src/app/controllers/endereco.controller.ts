import { EnderecoRepository } from '../repositories/endereco.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { ApiService } from '../services/api.service'

@injectable()
class EnderecoController {

  constructor(
    @inject("EnderecoRepository")
    private enderecoRepository: EnderecoRepository,
    private apiService: ApiService
  ) { }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.enderecoRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.enderecoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.enderecoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.enderecoRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.enderecoRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  buscaCep = async (request: Request, response: Response): Promise<void> => {

    const res = await this.apiService.buscaCep(request.params.cep)

    response.status(200).send(res)
  }

  buscaCidade = async (request: Request, response: Response): Promise<void> => {

    const res = await this.apiService.buscaCidade(request.params.search)

    response.status(200).send(res)
  }

}

export { EnderecoController }

import { EnderecoRepository } from '../repositories/endereco.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'

@injectable()
class EnderecoController {

    constructor(
        @inject("EnderecoRepository")
        private enderecoRepository: EnderecoRepository
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


}

export { EnderecoController }

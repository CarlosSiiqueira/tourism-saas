import { ProdutoRepository } from '../repositories/produto.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'

@injectable()
class ProdutoController {
    constructor(
        @inject("ProdutoRepository")
        private produtoRepository: ProdutoRepository
    ) { }


    create = async (request: Request, response: Response): Promise<void> => {

        const res = await this.produtoRepository.create(request.body)

        response.status(200).send(res)
    }

    find = async (request: Request, response: Response): Promise<void> => {

        const res = await this.produtoRepository.find(request.params.id)

        response.status(200).send(res)
    }

    findAll = async (request: Request, response: Response): Promise<void> => {

        const res = await this.produtoRepository.findAll()

        response.status(200).send(res)
    }

    update = async (request: Request, response: Response): Promise<void> => {

        const res = await this.produtoRepository.update(request.body, request.params.id)

        response.status(200).send(res)
    }

    delete = async (request: Request, response: Response): Promise<void> => {

        const res = await this.produtoRepository.delete(request.params.id)

        response.status(200).send(res)
    }

}

export { ProdutoController }

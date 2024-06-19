import { ProdutoRepository } from '../repositories/produto.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class ProdutoController {
  constructor(
    @inject("ProdutoRepository")
    private produtoRepository: ProdutoRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.produtoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

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

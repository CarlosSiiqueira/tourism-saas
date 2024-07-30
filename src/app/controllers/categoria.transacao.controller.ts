import { injectable, inject } from "tsyringe";
import { CategoriaTransacaoRepository } from "../repositories/categoria.transacao.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";

@injectable()
class CategoriaTransacaoController {

  constructor(
    @inject("CategoriaTransacaoRepository")
    private categoriaTransacaoRepository: CategoriaTransacaoRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.categoriaTransacaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.categoriaTransacaoRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.categoriaTransacaoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.categoriaTransacaoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.categoriaTransacaoRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.categoriaTransacaoRepository.delete(request.params.id)

    response.status(200).send(res)
  }
}

export { CategoriaTransacaoController }
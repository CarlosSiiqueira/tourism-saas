import { injectable, inject } from "tsyringe";
import { CategoriaTransacaoRepository } from "../repositories/categoria.transacao.repository";
import { Request, Response } from "express";

@injectable()
class CategoriaTransacaoController {

  constructor(
    @inject("CategoriaTransacaoRepository")
    private categoriaTransacaoRepository: CategoriaTransacaoRepository
  ) { }

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
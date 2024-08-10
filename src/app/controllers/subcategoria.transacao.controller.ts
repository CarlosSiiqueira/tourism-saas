import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { SubCategoriaTransacaoRepository } from "../repositories/subcategoria.transacao.repository";

@injectable()
class SubCategoriaTransacaoController {

  constructor(
    @inject("SubCategoriaTransacaoRepository")
    private subCategoriaTransacaoRepository: SubCategoriaTransacaoRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.subCategoriaTransacaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.subCategoriaTransacaoRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.subCategoriaTransacaoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.subCategoriaTransacaoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.subCategoriaTransacaoRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.subCategoriaTransacaoRepository.delete(request.params.id)

    response.status(200).send(res)
  }
}

export { SubCategoriaTransacaoController }

import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { SubCategoriaTransacaoRepository } from "../repositories/subcategoria.transacao.repository";
import { LogService } from "../services/log.service";

@injectable()
class SubCategoriaTransacaoController {

  constructor(
    @inject("SubCategoriaTransacaoRepository")
    private subCategoriaTransacaoRepository: SubCategoriaTransacaoRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.subCategoriaTransacaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.subCategoriaTransacaoRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'SubCategoria Transacao',
      usuariosId: user.id
    })

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

    let user = JSON.parse(request.headers.user as string);

    const subCategoria = await this.subCategoriaTransacaoRepository.find(request.params.id)
    const res = await this.subCategoriaTransacaoRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(res),
      oldData: JSON.stringify(subCategoria),
      rotina: 'SubCategoria Transacao',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.subCategoriaTransacaoRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'SubCategoria Transacao',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }
}

export { SubCategoriaTransacaoController }

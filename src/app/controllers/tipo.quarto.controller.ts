import { injectable, inject } from "tsyringe";
import { TipoQuartoRepository } from "../repositories/tipo.quarto.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";

@injectable()
class TipoQuartoController {

  constructor(
    @inject("TipoQuartoRepository")
    private tipoQuartoRepository: TipoQuartoRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.tipoQuartoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.tipoQuartoRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Tipo Quarto',
      usuariosId: user.id
    })


    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.tipoQuartoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const tipoQuarto = await this.tipoQuartoRepository.find(request.params.id)
    const res = await this.tipoQuartoRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(res),
      oldData: JSON.stringify(tipoQuarto),
      rotina: 'Tipo Quarto',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.tipoQuartoRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Tipo Quarto',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }
}

export { TipoQuartoController }
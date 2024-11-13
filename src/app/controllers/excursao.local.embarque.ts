import { injectable, inject } from "tsyringe";
import { ExcursaoLocalEmbarqueRepository } from "../repositories/excursao.local.embarque.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";

@injectable()
class ExcursaoLocalEmbarqueController {

  constructor (
    @inject("ExcursaoLocalEmbarqueRepository")
    private excursaoLocalEmbarqueRepository: ExcursaoLocalEmbarqueRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoLocalEmbarqueRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.excursaoLocalEmbarqueRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Excursão Local Embarque',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoLocalEmbarqueRepository.find(request.params.idExcursao)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoLocalEmbarqueRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const categoriaTransacao = await this.excursaoLocalEmbarqueRepository.find(request.params.id)
    const res = await this.excursaoLocalEmbarqueRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, ...request.body }),
      oldData: JSON.stringify(categoriaTransacao),
      rotina: 'Excursão Local Embarque',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.excursaoLocalEmbarqueRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Excursão Local Embarque',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }
}

export { ExcursaoLocalEmbarqueController }

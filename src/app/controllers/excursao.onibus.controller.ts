import { ExcursaoOnibusRepository } from '../repositories/excursao.onibus.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'

@injectable()
class ExcursaoOnibusController {
  constructor(
    @inject("ExcursaoOnibusRepository")
    private excursaoOnibusRepository: ExcursaoOnibusRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoOnibusRepository.index(request.params.idExcursao, { orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Excursões/Onibus',
      usuariosId: request.body.usuarioCadastro
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.find(request.params.idCadeira)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoOnibusRepository.findAll(request.params.idExcursao)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const oldExcursaoOnibus = await this.excursaoOnibusRepository.find(request.params.id)
    const excursaoOnibus = await this.excursaoOnibusRepository.update(request.body, request.params.id)

    if (excursaoOnibus) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: request.params.id, ...request.body }),
        oldData: JSON.stringify(oldExcursaoOnibus),
        rotina: 'Excursões/Onibus',
        usuariosId: user.id
      })
    }

    response.status(200).send(excursaoOnibus)
  }
}

export { ExcursaoOnibusController }

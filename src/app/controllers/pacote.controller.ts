import { PacoteRepository } from '../repositories/pacote.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteService } from '../services/pacote.service'
import { LogService } from '../services/log.service'

@injectable()
class PacoteController {

  constructor(
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository,
    private pacoteService: PacoteService,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.pacoteRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.pacoteRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res.pacote.id, ...request.body }),
      oldData: '',
      rotina: 'Destinos',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const pacote = await this.pacoteRepository.find(request.params.id)
    const res = await this.pacoteRepository.update(request.body, request.params.id)

    if (res.pacote) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify(res.pacote),
        oldData: JSON.stringify(pacote),
        rotina: 'Destinos',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.pacoteRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Destinos',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }

  listImagesPacote = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pacoteService.listImagesPacote(request.params.search)

    response.status(200).send(res)
  }
}

export { PacoteController }

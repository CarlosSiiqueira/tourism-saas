import { injectable, inject } from "tsyringe";
import { ConfiguracoesRepository } from "../repositories/configuracoes.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";

@injectable()
class ConfiguracoesController {

  constructor(
    @inject("ConfiguracoesRepository")
    private configuracoesRepository: ConfiguracoesRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.configuracoesRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.configuracoesRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Configurações',
      usuariosId: user.id
    })

    response.status(201).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.configuracoesRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.configuracoesRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const configuracao = await this.configuracoesRepository.find(request.params.id)
    const res = await this.configuracoesRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, ...request.body }),
      oldData: JSON.stringify(configuracao),
      rotina: 'Configurações',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.configuracoesRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Configurações',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }
}

export { ConfiguracoesController }

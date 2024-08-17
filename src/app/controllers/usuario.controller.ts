import { UsuarioRepository } from '../repositories/usuario.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class UsuarioController {
  constructor(
    @inject("UsuarioRepository")
    private usuarioRepository: UsuarioRepository,
    private authService: AuthService = new AuthService(usuarioRepository)
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const usuarios = await this.usuarioRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(usuarios)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  login = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.login(request.body.username, request.body.password)

    response.status(200).send(res)
  }

  auth = async (request: Request, response: Response): Promise<void> => {
    const res = await this.authService.authenticate(request.body.username, request.body.password)

    response.status(200).send(res)
  }

}

export { UsuarioController }

import { UsuarioRepository } from '../repositories/usuario.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

@injectable()
class UsuarioController {
  constructor(
    @inject("UsuarioRepository")
    private usuarioRepository: UsuarioRepository,
    private authService: AuthService = new AuthService(usuarioRepository)
  ) { }

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

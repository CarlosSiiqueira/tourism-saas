import { UsuarioRepository } from '../repositories/usuario.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'
import { generateRandomString } from '../../shared/utils/encrypt'
import { EmailService } from '../services/mail.service'
import { htmlEmailCadastro } from '../../shared/helper/html'
import { PessoaService } from '../services/pessoa.service'

@injectable()
class UsuarioController {
  constructor (
    @inject("UsuarioRepository")
    private usuarioRepository: UsuarioRepository,
    private authService: AuthService = new AuthService(usuarioRepository),
    private logService: LogService,
    private emailService: EmailService,
    private pessoaService: PessoaService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const usuarios = await this.usuarioRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(usuarios)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.usuarioRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Usuário',
      usuariosId: user.id
    })

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

    let user = JSON.parse(request.headers.user as string);

    const usuario = await this.usuarioRepository.find(request.params.id)
    const res = await this.usuarioRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(res),
      oldData: JSON.stringify(usuario),
      rotina: 'Usuário',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.usuarioRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Usuário',
        usuariosId: user.id
      })
    }

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

  changePassword = async (request: Request, response: Response): Promise<void> => {

    const { body, params, headers } = request
    const { id } = params

    let user = JSON.parse(headers.user as string);

    const usuario = await this.usuarioRepository.find(id)
    const res = await this.usuarioRepository.changePassword(id, body)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(res),
      oldData: JSON.stringify(usuario),
      rotina: 'Usuário/Alterar Senha',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  registerUserClient = async (request: Request, response: Response): Promise<void> => {

    const { body, headers } = request
    let user: string = JSON.parse(headers.user as string)?.id
    const userName: string = body.email
    const password = generateRandomString(8)
    const subject: string = 'Seu cadastro na Prados Turismo'
    const textEmail: string = htmlEmailCadastro(userName, password)

    const userClient = await this.usuarioRepository.create({
      nome: userName,
      username: userName,
      usuarioCadastro: user,
      tipo: 3,
      email: userName,
      password,
      ativo: true,
      meta: null,
      comissao: null
    })

    const pessoa = await this.pessoaService.findByCpf(body.cpf)

    if (pessoa && userClient) {
      await this.pessoaService.setUser(pessoa.id, userClient)
    }

    if (!pessoa) {
      await this.pessoaService.create({
        nome: body.nome,
        cpf: body.cpf,
        telefoneWpp: body.telefone,
        email: userName,
        sexo: "M",
        observacoes: "Cadastrado via criação de usuário no site",
        telefone: body.telefone,
        contato: null,
        dataNascimento: null,
        emissor: null,
        rg: null,
        telefoneContato: null,
        usuarioCadastro: user,
        userId: userClient
      }, null)
    }

    await this.emailService.sendEmail(userName, subject, textEmail, 3)

    response.status(200).send(userClient)
  }

  loginUserClient = async (request: Request, response: Response): Promise<void> => {

    const res = await this.usuarioRepository.loginUserClient(request.body.username, request.body.password)

    response.status(200).send(res)
  }

}

export { UsuarioController }

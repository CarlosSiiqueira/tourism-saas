import { PessoaRepository } from '../repositories/pessoa.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { EnderecoRepository } from '../repositories/endereco.repository'
import { EnderecoService } from '../services/endereco.service'
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'

@injectable()
class PessoaController {
  constructor (
    @inject("PessoaRepository")
    private pessoaRepository: PessoaRepository,
    private enderecoService: EnderecoService,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.pessoaRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let codigoEndereco: string = ''

    try {
      codigoEndereco = await this.enderecoService.findOrCreateAddress({
        cep: request.body.cep || '',
        cidade: request.body.cidade || '',
        complemento: request.body.complemento || '',
        logradouro: request.body.logradouro || '',
        numero: request.body.numero || '',
        uf: request.body.uf || '',
        bairro: request.body.bairro || ''
      })


    } catch (error) {
      response.status(500).send(`Erro ao incluir endereço, verifique body (cep,numero) para buscar endereço
                 ou (cep, cidade, complemento, logradouro, numero, uf) para criar novo `)
      return;
    }

    let user = JSON.parse(request.headers.user as string);

    const res = await this.pessoaRepository.create(request.body, codigoEndereco)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: '',
      rotina: 'Cliente',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pessoaRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pessoaRepository.findAll()

    response.status(200).send(res)
  }

  findByCpf = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pessoaRepository.findByCpf(request.params.cpf)

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let codigoEndereco: string = ''

    try {
      codigoEndereco = await this.enderecoService.findOrCreateAddress({
        cep: request.body.cep || '',
        cidade: request.body.cidade || '',
        complemento: request.body.complemento || '',
        logradouro: request.body.logradouro || '',
        numero: request.body.numero || '',
        uf: request.body.uf || '',
        bairro: request.body.bairro || ''
      })


    } catch (error) {
      response.status(500).send(`Erro ao incluir endereço, verifique body (cep,numero) para buscar endereço
                 ou (cep, cidade, complemento, logradouro, numero, uf) para criar novo `)
      return;
    }

    let user = JSON.parse(request.headers.user as string);

    const oldPessoa = await this.pessoaRepository.find(request.params.id)
    const pessoa = await this.pessoaRepository.update(request.body, request.params.id, codigoEndereco)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(pessoa),
      oldData: JSON.stringify(oldPessoa),
      rotina: 'Cliente',
      usuariosId: user.id
    })

    response.status(200).send(pessoa)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.pessoaRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: JSON.stringify(res),
        oldData: null,
        rotina: 'Cliente',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }

  getDataPessoa = async (request: Request, response: Response): Promise<void> => {

    const { id } = request.params

    const pessoa = await this.pessoaRepository.getDataPessoa(id)

    response.send(pessoa).status(200)
  }

}

export { PessoaController }

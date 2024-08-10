import { PessoaRepository } from '../repositories/pessoa.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { EnderecoRepository } from '../repositories/endereco.repository'
import { EnderecoService } from '../services/endereco.service'
import { formatIndexFilters } from '../../shared/utils/filters'

@injectable()
class PessoaController {
  constructor(
    @inject("PessoaRepository")
    private pessoaRepository: PessoaRepository,
    private enderecoService: EnderecoService
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

    const res = await this.pessoaRepository.create(request.body, codigoEndereco)

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

    const res = await this.pessoaRepository.update(request.body, request.params.id, codigoEndereco)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.pessoaRepository.delete(request.params.id)

    response.status(200).send(res)
  }

}

export { PessoaController }

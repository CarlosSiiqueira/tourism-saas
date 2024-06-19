import { LocalEmbarqueRepository } from '../repositories/local.embarque.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { EnderecoRepository } from '../repositories/endereco.repository'
import { EnderecoService } from '../services/endereco.service'

@injectable()
class LocalEmbarqueController {
  constructor(
    @inject("LocalEmbarqueRepository")
    private localEmbarqueRepository: LocalEmbarqueRepository,
    @inject("EnderecoRepository")
    private enderecoRepository: EnderecoRepository,
    private enderecoService: EnderecoService = new EnderecoService(enderecoRepository)
  ) { }


  create = async (request: Request, response: Response): Promise<void> => {

    let codigoEndereco: string = ''

    try {
      codigoEndereco = await this.enderecoService.findOrCreateAddress({
        id: request.body.codigoEndereco || null,
        cep: request.body.cep || '',
        cidade: request.body.cidade || '',
        complemento: request.body.complemento || '',
        logradouro: request.body.logradouro || '',
        numero: request.body.numero || '',
        uf: request.body.uf || ''
      })

      request.body.codigoEndereco = codigoEndereco

    } catch (error) {
      response.status(500).send(`Erro ao incluir endereço, verifique body (cep,numero) para buscar endereço
                 ou (cep, cidade, complemento, logradouro, numero, uf) para criar novo `)
      return;
    }

    const res = await this.localEmbarqueRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.localEmbarqueRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.localEmbarqueRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.localEmbarqueRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.localEmbarqueRepository.delete(request.params.id)

    response.status(200).send(res)
  }

}

export { LocalEmbarqueController }

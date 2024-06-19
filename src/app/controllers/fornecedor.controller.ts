import { injectable, inject } from "tsyringe";
import { Request, Response } from "express"
import { FornecedorRepository } from "../repositories/fornecedor.repository"
import { EnderecoRepository } from "../repositories/endereco.repository";
import { EnderecoService } from "../services/endereco.service";
import { formatIndexFilters } from "../../shared/utils/filters";

@injectable()
class FornecedorController {

  constructor(
    @inject("FornecedorRepository")
    private fornecedorRepository: FornecedorRepository,
    @inject("EnderecoRepository")
    private enderecoRepository: EnderecoRepository,
    private enderecoService: EnderecoService = new EnderecoService(enderecoRepository)
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.fornecedorRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)

  }

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

    const res = await this.fornecedorRepository.create(request.body)

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.fornecedorRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.fornecedorRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    const res = await this.fornecedorRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.fornecedorRepository.delete(request.params.id)

    response.status(200).send(res)
  }

}

export { FornecedorController }

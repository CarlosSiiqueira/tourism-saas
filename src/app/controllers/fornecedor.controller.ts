import { injectable, inject } from "tsyringe";
import { Request, Response } from "express"
import { FornecedorRepository } from "../repositories/fornecedor.repository"
import { EnderecoRepository } from "../repositories/endereco.repository";
import { EnderecoService } from "../services/endereco.service";
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";

@injectable()
class FornecedorController {

  constructor(
    @inject("FornecedorRepository")
    private fornecedorRepository: FornecedorRepository,
    private enderecoService: EnderecoService,
    private logService: LogService
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
        cep: request.body.cep || '',
        cidade: request.body.cidade || '',
        complemento: request.body.complemento || '',
        logradouro: request.body.logradouro || '',
        numero: request.body.numero || '',
        uf: request.body.uf || '',
        bairro: request.body.bairro || ''
      })

      request.body.codigoEndereco = codigoEndereco

    } catch (error) {
      response.status(500).send(`Erro ao incluir endereço, verifique body (cep,numero) para buscar endereço
                 ou (cep, cidade, complemento, logradouro, numero, uf) para criar novo `)
      return;
    }

    let user = JSON.parse(request.headers.user as string);

    const res = await this.fornecedorRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Fornecedor',
      usuariosId: user.id
    })

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

    let user = JSON.parse(request.headers.user as string);

    const oldFornecedor = await this.fornecedorRepository.find(request.params.id)
    const fornecedor = await this.fornecedorRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, ...request.body }),
      oldData: JSON.stringify(oldFornecedor),
      rotina: 'Fornecedor',
      usuariosId: user.id
    })

    response.status(200).send(fornecedor)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.fornecedorRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Fornecedor',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }

}

export { FornecedorController }

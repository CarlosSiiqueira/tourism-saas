import { injectable, inject } from "tsyringe";
import { Request, Response } from "express"
import { FornecedorRepository } from "../repositories/fornecedor.repository"
import { EnderecoRepository } from "../repositories/endereco.repository";

@injectable()
class FornecedorController {

    constructor(
        @inject("FornecedorRepository")
        private fornecedorRepository: FornecedorRepository,
        @inject("EnderecoRepository")
        private enderecoRepository: EnderecoRepository
    ) { }

    create = async (request: Request, response: Response): Promise<void> => {
        var codigoEndereco: string = ''

        try {

            const endereco = await this.enderecoRepository.findByCepAndNumber(request.body.cep, request.body.numero)

            if (endereco) {
                codigoEndereco = endereco.id
            }

            if (!codigoEndereco) {
                const endereco = await this.enderecoRepository.create(request.body)
                codigoEndereco = endereco
            }

        } catch (error) {
            response.status(500).send('Erro ao incluir endereço, verifique body')
            return;
        }

        const res = await this.fornecedorRepository.create(request.body, codigoEndereco)

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

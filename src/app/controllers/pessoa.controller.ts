import { PessoaRepository } from '../repositories/pessoa.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { EnderecoRepository } from '../repositories/endereco.repository'

@injectable()
class PessoaController {
    constructor(
        @inject("PessoaRepository")
        private pessoaRepository: PessoaRepository,
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

    update = async (request: Request, response: Response): Promise<void> => {

        const res = await this.pessoaRepository.update(request.body, request.params.id)

        response.status(200).send(res)
    }

    delete = async (request: Request, response: Response): Promise<void> => {

        const res = await this.pessoaRepository.delete(request.params.id)

        response.status(200).send(res)
    }

}

export { PessoaController }

import { ExcursaoRepository } from '../repositories/excursao.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'

@injectable()
class ExcursaoController {
    constructor(
        @inject("ExcursaoRepository")
        private excursaoRepository: ExcursaoRepository
    ) { }

    create = async (request: Request, response: Response): Promise<void> => {

        const res = await this.excursaoRepository.create(request.body)

        response.status(200).send(res)
    }

    find = async (request: Request, response: Response): Promise<void> => {

        const res = await this.excursaoRepository.find(request.params.id)

        response.status(200).send(res)
    }

    findAll = async (request: Request, response: Response): Promise<void> => {

        const res = await this.excursaoRepository.findAll()

        response.status(200).send(res)

    }

    delete = async (request: Request, response: Response): Promise<void> => {

        const res = await this.excursaoRepository.delete(request.params.id)

        response.status(200).send(res)

    }

    update = async (request: Request, response: Response): Promise<void> => {

        const res = await this.excursaoRepository.update(request.body, request.params.id)

        response.status(200).send(res)
    }

    createExcursaoQuartos = async (request: Request, response: Response): Promise<void> => {

    }

    findExcursaoQuartos = async (request: Request, response: Response): Promise<void> => {

    }

    updateExcursaoQuartos = async (request: Request, response: Response): Promise<void> => {

    }

}

export { ExcursaoController }

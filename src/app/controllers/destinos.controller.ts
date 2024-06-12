import { inject, injectable } from "tsyringe";
import { DestinosRepository } from "../repositories/destinos.repository";
import { Request, Response } from "express";

@injectable()
class DestinosController {

    constructor(
        @inject("DestinosRepository")
        private destinosRepository: DestinosRepository
    ) { }

    create = async (request: Request, response: Response): Promise<void> => {

        const res = await this.destinosRepository.create(request.body)

        response.status(200).send(res)
    }

    find = async (request: Request, response: Response): Promise<void> => {

        const res = await this.destinosRepository.find(request.params.id)

        response.status(200).send(res)
    }

    findAll = async (request: Request, response: Response): Promise<void> => {

        const res = await this.destinosRepository.findAll()

        response.status(200).send(res)
    }

    update = async (request: Request, response: Response): Promise<void> => {

        const res = await this.destinosRepository.update(request.body, request.params.id)

        response.status(200).send(res)
    }

    delete = async (request: Request, response: Response): Promise<void> => {

        const res = await this.destinosRepository.delete(request.params.id)

        response.status(200).send(res)
    }

}

export { DestinosController }

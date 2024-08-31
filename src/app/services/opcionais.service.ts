import { inject, injectable } from "tsyringe";
import { OpcionaisRepository } from "../repositories/opcionais.repository";
import { IOpcionaisDTO } from "../interfaces/Opcionais";

@injectable()
export class OpcionaisService {

  constructor(@inject("OpcionaisRepository")
  private opcionaisRepository: OpcionaisRepository) { }

  create = async (data: IOpcionaisDTO): Promise<string> => {

    const opcional = await this.opcionaisRepository.create(data)

    return opcional
  }

  deleteByReservaId = async (idReserva: string): Promise<string> => {

    const opcional = await this.opcionaisRepository.deleteByReservaId(idReserva)

    return opcional
  }

}
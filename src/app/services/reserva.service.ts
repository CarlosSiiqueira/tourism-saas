import { inject, injectable } from "tsyringe"
import { ReservaRepository } from "../repositories/reserva.repository"
import { IReservaDTO } from "../interfaces/Reserva"

@injectable()
export class ReservaService {

  constructor(
    @inject("ReservaRepository")
    private reservaRepository: ReservaRepository
  ) { }


  create = async ({
    codigoUsuario,
    passageiros,
    idExcursao }: IReservaDTO): Promise<string> => {

    const newReserva = await this.reservaRepository.create({
      codigoUsuario,
      passageiros,
      idExcursao
    })

    return newReserva
  }

}

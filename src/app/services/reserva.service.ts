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
    reserva,
    codigoUsuario,
    codigoFinanceiro }: IReservaDTO): Promise<string> => {

    const newReserva = await this.reservaRepository.create({
      reserva,
      codigoUsuario,
      codigoFinanceiro
    })

    return newReserva
  }

}

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
    idExcursao,
    desconto,
    localEmbarqueId }: IReservaDTO): Promise<string> => {

    const newReserva = await this.reservaRepository.create({
      codigoUsuario,
      passageiros,
      idExcursao,
      desconto,
      localEmbarqueId
    })

    return newReserva
  }

  confirmaReserva = async (id: string): Promise<string> => {

    const reserva = await this.reservaRepository.setConfirm(id, true)

    return reserva;
  }

  removeConfirmReserva = async (id: string): Promise<string> => {

    const reserva = await this.reservaRepository.setConfirm(id, false)

    return reserva;
  }
}

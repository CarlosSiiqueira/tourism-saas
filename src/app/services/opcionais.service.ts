import { inject, injectable } from "tsyringe";
import { OpcionaisRepository } from "../repositories/opcionais.repository";
import { IOpcionaisDTO, IOpcionaisGroupByResponse, IOpcionaisResponse } from "../interfaces/Opcionais";

interface IOptionalSumary {
  sum: number,
  nome: string
  id: string
}

@injectable()
export class OpcionaisService {

  constructor (@inject("OpcionaisRepository")
  private opcionaisRepository: OpcionaisRepository) { }

  create = async (data: IOpcionaisDTO): Promise<string> => {

    const opcional = await this.opcionaisRepository.create(data)

    return opcional
  }

  deleteByReservaId = async (idReserva: string): Promise<string> => {

    const opcional = await this.opcionaisRepository.deleteByReservaId(idReserva)

    return opcional
  }

  summary = async (idExcursao: string): Promise<IOptionalSumary[]> => {

    const groupBy = await this.opcionaisRepository.summary(idExcursao)

    const summary = await Promise.all(
      groupBy.map(async (value) => {
        return { ...(await this.opcionaisRepository.findByProduto(value.idProduto)).Produto, sum: value._sum?.qtd || 0 }
      })
    )

    return summary
  }

  findByReserva = async (idReserva: string): Promise<IOpcionaisResponse[]> => {
    return await this.opcionaisRepository.findByReserva(idReserva)
  }
}

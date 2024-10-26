import { inject, injectable } from "tsyringe";
import { RankingClientesRepository } from "../repositories/ranking.clientes.repository";
import { IRankingClienteResponse } from "../interfaces/RankingCliente";


@injectable()
export class RankingClientesService {

  constructor (
    @inject("RankingClientesRepository")
    private rankingClientesRepository: RankingClientesRepository
  ) { }

  find = async (id: string): Promise<IRankingClienteResponse> => {
    return await this.rankingClientesRepository.find(id)
  }

  rankUp = async (totalTrips: number, idCurrentRank: string): Promise<{ rankUp: boolean, rank?: IRankingClienteResponse }> => {

    const rank = await this.rankingClientesRepository.findByTrips(totalTrips)

    if (rank) {
      return {
        rankUp: rank.id === idCurrentRank ? false : true,
        rank: rank
      }
    }

    return {
      rankUp: false
    }
  }
}

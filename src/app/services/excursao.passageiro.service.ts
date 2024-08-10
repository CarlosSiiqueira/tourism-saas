import { inject, injectable } from "tsyringe";
import { ExcursaoPassageirosRepository } from "../repositories/excursao.passageiros.repository";
import { IExcursaoPassageirosDTO, IExcursaoPassageirosResponse } from "../interfaces/ExcursaoPassageiros";

@injectable()
export class ExcursaoPassageiroService {

  constructor(
    @inject("ExcursaoPassageirosRepository")
    private excursaoPassageiroRepository: ExcursaoPassageirosRepository
  ) { }

  create = async ({
    idExcursao,
    idPassageiro,
    localEmbarque,
    reserva
  }: IExcursaoPassageirosDTO): Promise<string[]> => {

    const passageiro = await this.excursaoPassageiroRepository.create({
      idExcursao,
      idPassageiro,
      localEmbarque,
      reserva
    })

    return passageiro
  }

  findByIdPessoa = async (idsPassageiros: [string]): Promise<IExcursaoPassageirosResponse[]> => {

    const passageiros = await this.excursaoPassageiroRepository.findByIdPessoa(idsPassageiros)

    return passageiros
  }

}

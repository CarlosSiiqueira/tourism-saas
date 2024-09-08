import { inject, injectable } from "tsyringe";
import { ExcursaoOnibusRepository } from "../repositories/excursao.onibus.repository";
import { IExcursaoOnibusResponse } from "../interfaces/ExcursaoOnibus";

@injectable()
export class ExcursaoOnibusService {

  constructor(
    @inject("ExcursaoOnibusRepository")
    private excursaoOnibusRepository: ExcursaoOnibusRepository
  ) { }


  findAll = async (idExcursao: string): Promise<IExcursaoOnibusResponse[]> => {

    const passageirosPoltronas = await this.excursaoOnibusRepository.findAll(idExcursao)

    return passageirosPoltronas
  }


  deleteManyByIdPassageiro = async (idPassageiros: string[], idExcursao: string): Promise<any> => {

    const passageiro = await this.excursaoOnibusRepository.deleteManyByIdPassageiro(idPassageiros, idExcursao);

    return passageiro
  }

}
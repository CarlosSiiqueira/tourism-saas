import { inject, injectable } from "tsyringe";
import { IExcursaoPassageirosListResponse, IExcursaoPassageirosResponse } from "../interfaces/ExcursaoPassageiros";
import { IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos";
import { ExcursaoRepository } from "../repositories/excursao.repository";
import { IExcursaoOnibusResponse } from "../interfaces/ExcursaoOnibus";
import { IExcursaoResponse } from "../interfaces/Excursao";

@injectable()
export class ExcursaoService {

  constructor (
    @inject("ExcursaoRepository")
    private excursaoRepository: ExcursaoRepository
  ) { }

  filterPassageirosWithoutRoom = async (
    passageiros: IExcursaoPassageirosListResponse[],
    passsageirosQuartos: IExcursaoQuartosResponse[]
  ): Promise<IExcursaoPassageirosListResponse[]> => {
    let pessoaQuarto: Array<any> = []

    passsageirosQuartos.map(element => {
      pessoaQuarto = element.Passageiros.map((passageiro) => { return passageiro.id })
    });

    pessoaQuarto.forEach(quartos => {
      passageiros = passageiros.filter((pessoa) => pessoa.id !== quartos)
    })

    return passageiros;
  }

  filterPassageirosWithoutChair = async (
    passageiros: IExcursaoPassageirosListResponse[],
    passsageirosOnibus: IExcursaoOnibusResponse[]
  ): Promise<IExcursaoPassageirosListResponse[]> => {

    let pessoaOnibus: Array<any> = []

    passsageirosOnibus.forEach(element => {
      pessoaOnibus.push(element.Passageiro.id)
    });

    pessoaOnibus.forEach(onibus => {
      passageiros = passageiros.filter((pessoa) => pessoa.id !== onibus)
    })

    return passageiros;
  }

  find = async (id: string): Promise<IExcursaoResponse> => {
    return await this.excursaoRepository.find(id)
  }

}
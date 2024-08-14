import { inject, injectable } from "tsyringe";
import { IExcursaoPassageirosListResponse } from "../interfaces/ExcursaoPassageiros";
import { IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos";
import { ExcursaoRepository } from "../repositories/excursao.repository";

@injectable()
export class ExcursaoService {

  constructor(
    @inject("ExcursaoRepository")
    private excursaoRepository: ExcursaoRepository
  ) { }

  filterPassageirosWithoutRoom = async (
    passageiros: IExcursaoPassageirosListResponse[],
    passsageirosQuartos: IExcursaoQuartosResponse[]
  ): Promise<IExcursaoPassageirosListResponse[]> => {
    let pessoaQuarto: Array<any> = []

    passsageirosQuartos.forEach(element => {
      pessoaQuarto.push(element.Passageiros.map((passageiro) => {
        return { ...passageiro.Pessoa }
      }))
    });

    pessoaQuarto.forEach(quartos => {
      quartos.forEach((hospede: IExcursaoPassageirosListResponse) => {
        passageiros = passageiros.filter((pessoa) => pessoa.id !== hospede.id)
      });
    })

    return passageiros;
  }

}
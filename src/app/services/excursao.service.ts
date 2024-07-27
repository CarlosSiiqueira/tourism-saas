import { IExcursaoPassageirosListResponse } from "../interfaces/ExcursaoPassageiros";
import { IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos";

export class ExcursaoService {

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
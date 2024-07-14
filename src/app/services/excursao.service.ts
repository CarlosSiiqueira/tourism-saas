import { IExcursaoPassageirosListResponse } from "../interfaces/ExcursaoPassageiros";
import { IExcursaoQuartosListRresponse } from "../interfaces/ExcursaoQuartos";

export class ExcursaoService {

  filterPassageirosWithoutRoom = async (
    passageiros: IExcursaoPassageirosListResponse[],
    passsageirosQuartos: IExcursaoQuartosListRresponse[]
  ): Promise<IExcursaoPassageirosListResponse[]> => {
    let pessoaQuarto: Array<any> = []

    passsageirosQuartos.forEach(element => {
      pessoaQuarto.push(element.Passageiros)
    });

    pessoaQuarto.forEach(quartos => {
      quartos.forEach((hospede: IExcursaoPassageirosListResponse) => {
        passageiros = passageiros.filter((pessoa) => pessoa.id !== hospede.id)
      })
    })

    return passageiros;
  }

}
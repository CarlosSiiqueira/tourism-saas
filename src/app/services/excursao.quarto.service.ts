import { inject, injectable } from "tsyringe";
import { ExcursaoQuartosRepository } from "../repositories/excursao.quartos.repository";
import { IIndex } from "../interfaces/Helper";
import { IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos";

interface summary {
  id?: string | null
  nome?: string | null
  count: number
}

@injectable()
export class ExcursaoQuartosService {

  constructor(
    @inject("ExcursaoQuartosRepository")
    private excursaoQuartoRepositroy: ExcursaoQuartosRepository
  ) { }

  countRoomTypes = async (quartos: IExcursaoQuartosResponse[], data: IIndex): Promise<summary[]> => {

    let roomTypes = quartos.map((value) => {
      return { id: value.TipoQuarto?.id, nome: value.TipoQuarto?.nome, count: 0 }
    })

    roomTypes = roomTypes.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.id === value.id
      ))
    );

    const updatedRoomTypes = await Promise.all(
      roomTypes.map(async (room) => {
        data.filter = { idTipoQuarto: room.id }
        let count = (await this.excursaoQuartoRepositroy.index(data)).count

        return { id: room.id, nome: room.nome, count: count }
      })
    )

    return updatedRoomTypes
  }

  findPassageirosWithRoom = async (idExcursao: string): Promise<IExcursaoQuartosResponse[]> => {

    const quartos = await this.excursaoQuartoRepositroy.findPassageirosWithRoom(idExcursao);

    return quartos;
  }

  find = async (idExcursao: string): Promise<IExcursaoQuartosResponse[]> => {

    const quartos = await this.excursaoQuartoRepositroy.find(idExcursao)

    return quartos
  }
}

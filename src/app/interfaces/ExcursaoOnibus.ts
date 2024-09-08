import { IIndex } from "./Helper"

export interface IExcursaoOnibus {
  index(idExcursao: string, data: IIndex): Promise<{ count: number, rows: IExcursaoOnibusResponse[] }>
  create(data: IExcursaoOnibusDTO): Promise<string>
  find(idCadeira: string): Promise<IExcursaoOnibusResponse>
  findAll(idExcursao: string): Promise<IExcursaoOnibusResponse[]>
  update(data: IExcursaoOnibusDTO, id: string): Promise<IExcursaoOnibusResponse>
  deleteManyByIdPassageiro(idPassageiros: string[], idExcursao: string): Promise<string[]>
}

export interface IExcursaoOnibusDTO {
  numeroCadeira: string
  dataCadastro: Date
  codigoPassageiro: string
  codigoExcursao: string
  usuarioCadastro: string
}

export interface IExcursaoOnibusResponse extends IExcursaoOnibusDTO {
  id: string
  Passageiro: {
    id: string
    idExcursao: string
    idPassageiro: string
    localEmbarque: string
    reserva: string
  }
}

import { IIndex } from "./Helper"

export interface IExcursaoOnibus {
  index(idExcursao: string, data: IIndex): Promise<{ count: number, rows: IExcursaoOnibusResponse[] }>
  create(data: IExcursaoOnibusDTO): Promise<string>
  find(idCadeira: string): Promise<IExcursaoOnibusResponse>
  findAll(idExcursao: string): Promise<IExcursaoOnibusResponse[]>
  update(data: IExcursaoOnibusDTO, id: string): Promise<IExcursaoOnibusResponse>
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
}

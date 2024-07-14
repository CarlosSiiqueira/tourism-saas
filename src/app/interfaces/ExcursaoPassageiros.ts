import { IIndex } from "./Helper"

export interface IExcursaoPassageiros {
  index(data: IIndex): Promise<{
    count: number,
    rows: IExcursaoPassageirosResponse[]
  }>
  create(data: IExcursaoPassageirosDTO): Promise<string[]>
  find(idExcursao: string): Promise<IExcursaoPassageirosResponse[]>
  findAll(): Promise<IExcursaoPassageirosResponse[]>
  listPassageiros(idExcursao: string): Promise<any>
  delete(idPassageiro: string, idExcursao: string): Promise<string[]>
}

export interface IExcursaoPassageirosDTO {
  idExcursao: string
  idPassageiro: string
  localEmbarque: string
  reserva: string
}

export interface IExcursaoPassageirosResponse extends IExcursaoPassageirosDTO {
  id: string
}


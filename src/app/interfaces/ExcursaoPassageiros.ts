import { IIndex } from "./Helper"

export interface IExcursaoPassageiros {
  index(data: IIndex): Promise<{
    count: number,
    rows: IExcursaoPassageirosResponse[]
  }>
  create(data: IExcursaoPassageirosDTO): Promise<string[]>
  find(id: string): Promise<IExcursaoPassageirosResponse>
  findAll(): Promise<IExcursaoPassageirosResponse[]>
  delete(idPassageiro: string, idExcursao: string): Promise<string[]>
}

export interface IExcursaoPassageirosDTO {
  idExcursao: string
  idPassageiro: string
  localEmbarque: string
}

export interface IExcursaoPassageirosResponse extends IExcursaoPassageirosDTO {
  id: string
}


import { IIndex } from "./Helper"

export interface IOpcionais {
  index(data: IIndex): Promise<{
    count: number
    rows: IOpcionaisResponse[]
  }>
  create(data: IOpcionaisDTO): Promise<string>
  find(id: string): Promise<IOpcionaisResponse>
  findAll(): Promise<IOpcionaisResponse[]>
  delete(id: string): Promise<string>
  update(data: IOpcionaisDTO, id: string): Promise<string[]>
}

export interface IOpcionaisDTO {
  idReserva: string
  idProduto: string
  qtd: number
  codigoUsuario: string
}

export interface IOpcionaisResponse extends IOpcionaisDTO {
  id: string
}

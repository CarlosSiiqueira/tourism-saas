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
  summary(idExcursao: string): Promise<IOpcionaisGroupByResponse[]>
  findByProduto(idProduto: string): Promise<IOpcionaisResponse>
}

export interface IOpcionaisDTO {
  idReserva: string
  idProduto: string
  qtd: number
  codigoUsuario: string
}

export interface IOpcionaisResponse extends IOpcionaisDTO {
  id: string
  Produto: {
    id: string
    nome: string
  }
}

export interface IOpcionaisGroupByResponse {
  _sum?: {
    qtd: number | null
  }

  idProduto: string
}

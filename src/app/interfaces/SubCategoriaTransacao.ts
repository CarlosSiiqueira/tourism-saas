import { IIndex } from "./Helper"

export interface ISubCategoriaTransacao {
  index(data: IIndex): Promise<{ count: number, rows: ISubCategoriaTransacaoResponse[] }>
  create(data: ISubCategoriaTransacaoDTO): Promise<string[]>
  find(id: string): Promise<ISubCategoriaTransacaoResponse | null>
  findAll(): Promise<ISubCategoriaTransacaoResponse[]>
  delete(id: string): Promise<string[]>
  update(data: ISubCategoriaTransacaoDTO, id: string): Promise<string[]>
}

export interface ISubCategoriaTransacaoDTO {
  nome: string
  codigoUsuario: string
}

export interface ISubCategoriaTransacaoResponse extends ISubCategoriaTransacaoDTO {
  id: string
}

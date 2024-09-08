import { IIndex } from "./Helper"

export interface ISubCategoriaTransacao {
  index(data: IIndex): Promise<{ count: number, rows: ISubCategoriaTransacaoResponse[] }>
  create(data: ISubCategoriaTransacaoDTO): Promise<string>
  find(id: string): Promise<ISubCategoriaTransacaoResponse | null>
  findAll(): Promise<ISubCategoriaTransacaoResponse[]>
  delete(id: string): Promise<ISubCategoriaTransacaoResponse>
  update(data: ISubCategoriaTransacaoDTO, id: string): Promise<ISubCategoriaTransacaoResponse>
}

export interface ISubCategoriaTransacaoDTO {
  nome: string
  codigoUsuario: string
}

export interface ISubCategoriaTransacaoResponse extends ISubCategoriaTransacaoDTO {
  id: string
}

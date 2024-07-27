import { IIndex } from "./Helper"

export interface ITipoQuarto {
  index(data: IIndex): Promise<{ count: number, rows: ITipoQuartoResponse[] }>
  create(data: ITipoQuartoDTO): Promise<string[]>
  find(id: string): Promise<ITipoQuartoResponse | null>
  findAll(): Promise<ITipoQuartoResponse[]>
  delete(id: string): Promise<string[]>
  update(data: ITipoQuartoDTO, id: string): Promise<string[]>
}

export interface ITipoQuartoDTO {
  nome: string
  codigoUsuario: string
}

export interface ITipoQuartoResponse extends ITipoQuartoDTO {
  id: string
}

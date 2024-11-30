import { IIndex } from "./Helper"

export interface IImagem {
  index (data: IIndex): Promise<{ count: number, rows: IImagemResponse[] }>
  create (data: IImagemDTO): Promise<string>
  find (id: string): Promise<IImagemResponse | null>
  findAll (): Promise<IImagemResponse[]>
  delete (id: string): Promise<IImagemResponse>
  update (data: IImagemDTO, id: string): Promise<IImagemResponse>
}

export interface IImagemDTO {
  url: string
  nome: string
  userId: string
}

export interface IImagemResponse extends IImagemDTO {
  id: string
}

import { IIndex } from "./Helper"

export interface IOpcionalEmbarque {
  index(data: IIndex): Promise<{
    count: number
    rows: IOpcionalEmbarqueResponse[]
  }>
  create(data: IOpcionalEmbarqueDTO): Promise<string>
  find(id: string): Promise<IOpcionalEmbarqueResponse>
  findAll(): Promise<IOpcionalEmbarqueResponse[]>
  delete(id: string): Promise<IOpcionalEmbarqueResponse>
  update(data: IOpcionalEmbarqueDTO, id: string): Promise<IOpcionalEmbarqueResponse>
}

export interface IOpcionalEmbarqueDTO {
  id: string
  embarcou: boolean
  data: Date
  idOpcional: string
  idPassageiro: string
}

export interface IOpcionalEmbarqueResponse extends IOpcionalEmbarqueDTO {
  id: string
}

import { IIndex } from "./Helper"

export interface IPacote {
  index(data: IIndex): Promise<{
    count: number,
    rows: IPacoteResponse[]
  }>
  create(data: IPacoteDTO): Promise<string[]>
  find(id: string): Promise<IPacoteResponse>
  findAll(): Promise<IPacoteResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IPacoteDTO, id: string): Promise<string[]>
}


export interface IPacoteDTO {
  nome: string
  valor: number
  descricao: string
  ativo: boolean
  dataCadastro: Date
  origem: number
  codigoLocalEmbarque: string
  codigoDestino: string | null
  usuarioCadastro: string
}

export interface IPacoteResponse extends IPacoteDTO {
  id: string
}

import { IIndex } from "./Helper"

export interface IPacote {
  index (data: IIndex): Promise<{
    count: number,
    rows: IPacoteResponse[]
  }>
  create (data: IPacoteDTO): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }>
  find (id: string): Promise<IPacoteResponse>
  findAll (): Promise<IPacoteResponse[]>
  delete (id: string): Promise<IPacoteResponse>
  update (data: IPacoteDTO, id: string): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }>
  setIdWP (id: string, idWP: number): Promise<string[]>
  getAllByIds (id: Array<number>): Promise<IPacoteResponse[]>
}


export interface IPacoteDTO {
  nome: string
  descricao: string
  ativo: boolean
  origem: number
  tipoTransporte: number
  urlImagem: string | null
  urlImgEsgotado: string | null
  idWP: number | null
  categoria: number | null
  usuarioCadastro: string
  opcionais?: [string]
  galeria?: [string]
}

export interface IPacoteResponse extends IPacoteDTO {
  id: string
}

export interface IPacoteFilter {
  nome?: {
    contains: string,
    mode: string
  }
  Produto?: {
    some: {
      nome: {
        contains: string
        mode: string
      }
    }
  }
}
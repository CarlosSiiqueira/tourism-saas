import { IIndex } from "./Helper"

export interface IFormaPagamento {
  index (data: IIndex): Promise<{ count: number, rows: IFormaPagamentoResponse[] }>
  create (data: IFormaPagamentoDTO): Promise<string[]>
  find (id: string): Promise<IFormaPagamentoResponse | null>
  findAll (): Promise<IFormaPagamentoResponse[]>
  delete (id: string): Promise<IFormaPagamentoResponse>
  update (data: IFormaPagamentoDTO, id: string): Promise<string>
}

export interface IFormaPagamentoDTO {
  nome: string
  dataCadastro: Date
  taxa: number
  taxa1x: number | null
  taxa2x: number | null
  taxa3x: number | null
  taxa4x: number | null
  taxa5x: number | null
  taxa6x: number | null
  taxa7x: number | null
  taxa8x: number | null
  taxa9x: number | null
  taxa10x: number | null
  taxa11x: number | null
  taxa12x: number | null
  qtdDiasRecebimento: number
  ativo: boolean
  creditCard: boolean
  usuarioCadastro: string
}

export interface IFormaPagamentoResponse extends IFormaPagamentoDTO {
  id: string
}

export interface IFormaPagamentoFilter {
  ativo?: boolean
  nome?: {
    contains: string,
    mode: string
  }
  Usuarios?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  taxa?: {
    equals: number
  }
}

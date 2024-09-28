import { IIndex } from "./Helper"

export interface IExcursao {
  index(data: IIndex): Promise<{
    count: number
    rows: IExcursaoResponse[]
  }>
  create(data: IExcursaoDTO): Promise<string>
  find(id: string): Promise<IExcursaoResponse>
  findAll(): Promise<IExcursaoResponse[]>
  delete(id: string): Promise<string>
  update(data: IExcursaoDTO, id: string): Promise<IExcursaoResponse>
  publish(id: string): Promise<IExcursaoResponse>
  concluir(id: string): Promise<IExcursaoResponse>
}

export interface IExcursaoDTO {
  nome: string
  dataInicio: Date
  dataFim: Date
  observacoes: string | null
  dataCadastro: Date
  ativo: boolean
  gerouFinanceiro: boolean
  vagas: number
  codigoPacote: string
  usuarioCadastro: string
  valor: number
}

export interface IExcursaoResponse extends IExcursaoDTO {
  id: string
}

export interface IExcursaoFilter {
  nome?: {
    contains: string,
    mode: string
  }
  Pacotes?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  dataInicio?: {
    gte: Date
  }
  dataFim?: {
    lte: Date,
  }
}

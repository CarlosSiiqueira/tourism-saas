import { JsonValue } from "@prisma/client/runtime/library"
import { IIndex } from "./Helper"

export interface IConfiguracao {
  index(data: IIndex): Promise<{
    count: number
    rows: IConfiguracaoResponse[]
  }>
  create(data: IConfiguracaoDTO): Promise<string>
  find(id: string): Promise<IConfiguracaoResponse>
  findAll(): Promise<IConfiguracaoResponse[]>
  delete(id: string): Promise<IConfiguracaoResponse>
  update(data: IConfiguracaoDTO, id: string): Promise<IConfiguracaoResponse>
  findByType(tipo: string): Promise<IConfiguracaoResponse>
}

export interface IConfiguracaoDTO {
  tipo: string
  configuracao: JsonValue | null
  dataCadastro: Date
  idUsuario: string
}

export interface IConfiguracaoResponse extends IConfiguracaoDTO {
  id: string
}

export interface IConfiguracaoFilter {
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
  saldo?: {
    equals: number
  }
  ativo?: boolean
}

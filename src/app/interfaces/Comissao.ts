import { JsonValue } from "@prisma/client/runtime/library"
import { IIndex } from "./Helper"

export interface IComissao {
  index (data: IIndex): Promise<{
    count: number
    rows: IComissaoResponse[]
  }>
  create (data: IComissaoDTO): Promise<string>
  find (id: string): Promise<IComissaoResponse>
  findAll (): Promise<IComissaoResponse[]>
  delete (id: string): Promise<IComissaoResponse>
  update (data: IComissaoDTO, id: string): Promise<IComissaoResponse>
  findByFinanceiro (idFinanceiro: string): Promise<IComissaoResponse | null>
  setPaid (id: string, date: Date): Promise<string>
}

export interface IComissaoDTO {
  periodo: string
  valor: number
  idTransacao: string
  usuariosId: string
}

export interface IComissaoResponse extends IComissaoDTO {
  id: string
}

export interface IComissaoFilter {
  Usuario?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  valor?: {
    equals: number
  }
}

import { IIndex } from "./Helper"

export interface IExcursaoLocalEmbarque {
  index (data: IIndex): Promise<{ count: number, rows: IExcursaoLocalEmbarqueResponse[] }>
  create (data: IExcursaoLocalEmbarqueDTO): Promise<string>
  find (id: string): Promise<IExcursaoLocalEmbarqueResponse | null>
  findAll (): Promise<IExcursaoLocalEmbarqueResponse[]>
  delete (id: string): Promise<IExcursaoLocalEmbarqueResponse>
  update (data: IExcursaoLocalEmbarqueDTO, id: string): Promise<IExcursaoLocalEmbarqueResponse>
}

export interface IExcursaoLocalEmbarqueDTO {
  idExcursao: string
  localEmbarque: [string]
}

export interface IExcursaoLocalEmbarqueResponse {
  id: string
  dataCadastro: Date
  LocalEmbarque: {
    id: string
    nome: string
    observacoes: string | null
    horaEmbarque: string
    dataCadastro: Date
    codigoEndereco: string
    usuarioCadastro: string
    ativo: boolean
  }[]
  idExcursao: string
}

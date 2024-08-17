import { IIndex } from "./Helper"

export interface IReserva {
  index(data: IIndex): Promise<{
    count: number
    rows: IReservaResponse[]
  }>
  create(data: IReservaDTO): Promise<string>
  find(id: string): Promise<IReservaResponse>
  findAll(): Promise<IReservaResponse[]>
  delete(id: string): Promise<string>
  update(data: IReservaDTO, id: string): Promise<string[]>
  setConfirm(id: string, status: boolean): Promise<string>
}

export interface IReservaDTO {
  reserva?: number
  codigoUsuario: string | null
  passageiros: [string]
  idExcursao: string
  desconto: number
  plataforma?: number
  localEmbarqueId: string
}

export interface IReservaResponse {
  id: string,
  reserva: number,
  status: boolean,
  codigoUsuario: string | null,
  desconto: number
  plataforma: number
  Pessoa?: {
    id: string,
    nome: string,
    cpf: string,
    rg: string | null
  }[],
  Excursao: {
    id: string,
    nome: string,
    dataInicio: Date,
    dataFim: Date
  },
  Usuario: {
    nome: string
  } | null
  LocalEmbarque: {
    nome: string
    horaEmbarque: string
  }
}

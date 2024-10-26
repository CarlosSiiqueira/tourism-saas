import { IIndex } from "./Helper"

export interface IRankingCliente {
  index (data: IIndex): Promise<{
    count: number
    rows: IRankingClienteResponse[]
  }>
  create (data: IRankingClienteDTO): Promise<string>
  find (id: string): Promise<IRankingClienteResponse | null>
  findAll (): Promise<IRankingClienteResponse[]>
  delete (id: string): Promise<IRankingClienteResponse>
  update (data: IRankingClienteDTO, id: string): Promise<IRankingClienteResponse>
  findByTrips (totalTrips: number): Promise<IRankingClienteResponse | null>
}


export interface IRankingClienteDTO {
  nome: string
  qtdMinViagens: number
  qtdMaxViagens: number
  usuariosId: string
}

export interface IRankingClienteResponse extends IRankingClienteDTO {
  id: string
}
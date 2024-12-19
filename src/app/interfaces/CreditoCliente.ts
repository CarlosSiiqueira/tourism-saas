import { IIndex } from "./Helper"

export interface ICreditoCliente {
  index (data: IIndex): Promise<{
    count: number
    rows: ICreditoClienteResponse[]
  }>
  create (data: ICreditoClienteDTO): Promise<string>
  find (id: string): Promise<ICreditoClienteResponse>
  findAll (): Promise<ICreditoClienteResponse[]>
  delete (id: string): Promise<ICreditoClienteResponse>
  update (data: ICreditoClienteDTO, id: string): Promise<ICreditoClienteResponse>
  findByCliente (idCliente: string): Promise<ICreditoClienteResponse[]>
  setUtilizadoEm (id: string, data: Date, valor: number): Promise<string>
}

export interface ICreditoClienteDTO {
  valor: number
  pessoasId: string
  idReserva: string
  usuariosId: string
}

export interface ICreditoClienteResponse extends ICreditoClienteDTO {
  id: string
}

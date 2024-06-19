export interface IDestinos {
  create(data: IDestinosDTO): Promise<string[]>
  find(id: string): Promise<IDestinosResponse | null>
  findAll(): Promise<IDestinosResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IDestinosDTO, id: string): Promise<string[]>
}

export interface IDestinosDTO {
  nome: string
  ativo: boolean
  dataCadastro: Date
  codigoEndereco: string
  usuarioCadastro: string
}

export interface IDestinosResponse extends IDestinosDTO {
  id: string
}

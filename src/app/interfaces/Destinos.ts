export interface IDestinos {
  create(nome: string): Promise<string[]>
  find(id: string): Promise<IDestinosResponse | null>
  findAll(): Promise<IDestinosResponse[]>
  findByName(name: string): Promise<IDestinosDTO | null>
  delete(id: string): Promise<string[]>
  update(data: IDestinosDTO, id: string): Promise<string[]>
}

export interface IDestinosDTO {
  nome: string
  ativo: boolean
}

export interface IDestinosResponse extends IDestinosDTO {
  id: string
}

export interface IExcursaoQuartos {
  create(data: IExcursaoQuartosDTO): Promise<string[]>
  find(idExcursao: string): Promise<IExcursaoQuartosResponse[]>
  findPassageirosWithRoom(idExcursao: string): Promise<IExcursaoQuartosResponse[]>
  update(data: IExcursaoQuartosDTO, id: string): Promise<string[]>
  delete(id: string): Promise<string[]>
}

export interface IExcursaoQuartosDTO {
  numeroQuarto: string
  dataCadastro: Date
  codigoExcursao: string
  idTipoQuarto: string,
  passageiros: [string]
  usuarioCadastro: string

}

export interface IExcursaoQuartosResponse {
  id: string
  numeroQuarto: string
  dataCadastro: Date
  codigoExcursao: string
  usuarioCadastro: string,
  Passageiros: {
    id: string
    Reservas: {
      reserva: number
    }
    Pessoa: {
      id: string,
      nome: string
    }
  }[]
  TipoQuarto?: {
    id: string
    nome: string
  } | null
}

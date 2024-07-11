export interface IExcursaoQuartos {
  create(data: IExcursaoQuartosDTO): Promise<string[]>
  find(idExcursao: string): Promise<IExcursaoQuartosResponse[]>
  update(data: IExcursaoQuartosDTO, id: string): Promise<string[]>
}

export interface IExcursaoQuartosDTO {
  numeroQuarto: string
  dataCadastro: Date
  codigoExcursao: string
  passageiros: [string]
  usuarioCadastro: string

}

export interface IExcursaoQuartosResponse {
  id: string
  numeroQuarto: string
  dataCadastro: Date
  codigoExcursao: string
  usuarioCadastro: string
  Passageiros: Array<{
    id: string,
    nome: string
  }>
}

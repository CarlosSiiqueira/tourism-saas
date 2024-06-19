export interface IExcursaoOnibus {
  create(data: IExcursaoOnibusDTO): Promise<string[]>
  find(idExcursao: string, idCadeira: string): Promise<IExcursaoOnibusResponse[]>
  update(data: IExcursaoOnibusDTO, id: string): Promise<string[]>
}

export interface IExcursaoOnibusDTO {
  numeroCadeira: string
  dataCadastro: Date
  codigoPassageiro: string
  codigoExcursao: string
  usuarioCadastro: string
}

export interface IExcursaoOnibusResponse extends IExcursaoOnibusDTO {
  id: string
}

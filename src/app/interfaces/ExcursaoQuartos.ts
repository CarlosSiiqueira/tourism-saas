export interface IExcursaoQuartos {
    create(data: IExcursaoQuartosDTO): Promise<string[]>
    find(idExcursao: string): Promise<IExcursaoQuartosResponse[]>
    update(data: IExcursaoQuartosDTO, id: string): Promise<string[]>
}

export interface IExcursaoQuartosDTO {
    numeroQuarto: string
    dataCadastro: Date
    codigoExcursao: string
    codigoPassageiro: string
    usuarioCadastro: string
}

export interface IExcursaoQuartosResponse extends IExcursaoQuartosDTO {
    id: string
}

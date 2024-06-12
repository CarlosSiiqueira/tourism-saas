export interface ILocalEmbarque {
    create(data: ILocalEmbarqueDTO): Promise<string[]>
    find(id: string): Promise<ILocalEmbarqueResponse | null>
    findAll(): Promise<ILocalEmbarqueResponse[]>
    delete(id: string): Promise<string[]>
    update(data: ILocalEmbarqueDTO, id: string): Promise<string[]>
}


export interface ILocalEmbarqueDTO {
    nome: string
    observacoes: string
    horaEmbarque: string
    dataCadastro: Date
    codigoEndereco: string
    usuarioCadastro: string
    ativo: boolean
}

export interface ILocalEmbarqueResponse extends ILocalEmbarqueDTO {
    id: string
}

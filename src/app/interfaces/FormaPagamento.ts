export interface IFormaPagamento {
    create(data: IFormaPagamentoDTO): Promise<string[]>
    find(id: string): Promise<IFormaPagamentoResponse | null>
    findAll(): Promise<IFormaPagamentoResponse[]>
    delete(id: string): Promise<string[]>
    update(data: IFormaPagamentoDTO, id: string): Promise<string[]>
}

export interface IFormaPagamentoDTO {
    nome: string
    dataCadastro: Date
    taxa: number
    qtdDiasRecebimento: number
    ativo: boolean
    codigoContaBancaria: string
    usuarioCadastro: string
}

export interface IFormaPagamentoResponse extends IFormaPagamentoDTO {
    id: string
}

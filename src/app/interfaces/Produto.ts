export interface IProduto {
    create(data: IProdutoDTO): Promise<string[]>
    find(id: string): Promise<IProdutoResponse | null>
    findAll(): Promise<IProdutoResponse[]>
    delete(id: string): Promise<string[]>
    update(data: IProdutoDTO, id: string): Promise<string[]>
}


export interface IProdutoDTO {
    nome: string
    estoque: number
    dataCompra: Date
    dataCadastro: Date
    ativo: boolean
    codigoFornecedor: string
    usuarioCadastro: string
}

export interface IProdutoResponse extends IProdutoDTO {
    id: string
}

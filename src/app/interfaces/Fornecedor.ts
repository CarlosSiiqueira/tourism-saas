export interface IFornecedor {
    create(data: IFornecedorDTO, codigoEndereco: string): Promise<string[]>
    find(id: string): Promise<IFornecedorResponse | null>
    findAll(): Promise<IFornecedorResponse[]>
    delete(id: string): Promise<string[]>
    update(data: IFornecedorDTO, id: string): Promise<string[]>
}

export interface IFornecedorDTO {
    cnpj: string
    site: string | null
    ativo: boolean
    codigoPessoa: string
    codigoEndereco: string
    usuarioCadastro: string
    produtosId: string | null
}

export interface IFornecedorResponse extends IFornecedorDTO {
    id: string
}

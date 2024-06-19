import { IIndex } from "./Helper"

export interface IProduto {
  index(data: IIndex): Promise<{
    count: number
    rows: IProdutoResponse[]
  }>
  create(data: IProdutoDTO): Promise<string[]>
  find(id: string): Promise<IProdutoResponse | null>
  findAll(): Promise<IProdutoResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IProdutoDTO, id: string): Promise<string[]>
}


export interface IProdutoDTO {
  nome: string
  estoque: number
  dataCompra?: Date | null
  ativo: boolean
  codigoFornecedor: string
  usuarioCadastro: string
}

export interface IProdutoResponse {
  id: string,
  nome: string,
  estoque: number,
  dataCompra?: Date | null,
  dataCadastro: Date,
  ativo: boolean,
  codigoFornecedor: string,
  usuarioCadastro: string,
  Fornecedor: {
    id: string,
    nome: string,
    fantasia: string,
    cnpj: string,
    site: string | null,
    ativo: boolean,
    dataCadastro: Date,
    observacoes?: string | null,
    telefone: string | null,
    email: string,
    contato?: string | null,
    telefoneContato?: string | null,
    codigoEndereco: string,
    usuarioCadastro: string
  }
}
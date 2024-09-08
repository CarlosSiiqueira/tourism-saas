import { IIndex } from "./Helper"

export interface IFornecedor {
  index(data: IIndex): Promise<{
    count: number
    rows: IFornecedorResponse[]
  }>
  create(data: IFornecedorDTO): Promise<string>
  find(id: string): Promise<IFornecedorResponse | null>
  findAll(): Promise<IFornecedorResponse[]>
  delete(id: string): Promise<IFornecedorResponse>
  update(data: IFornecedorDTO, id: string): Promise<IFornecedorResponse>
}

export interface IFornecedorDTO {
  nome: string
  fantasia: string
  cnpj: string
  site: string | null
  ativo: boolean
  dataCadastro: Date
  observacoes: string | null
  telefone: string | null
  email: string
  contato: string | null
  telefoneContato: string | null
  codigoEndereco: string
  usuarioCadastro: string
}

export interface IFornecedorResponse extends IFornecedorDTO {
  id: string
}

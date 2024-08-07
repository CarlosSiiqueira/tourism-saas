import { IIndex } from "./Helper"

export interface IPessoa {
  index(data: IIndex): Promise<{ count: number, rows: IPessoaResponse[] }>
  create(data: IPessoaDTO, codigoEndereco: string): Promise<string[]>
  find(id: string): Promise<IPessoaResponse | null>
  findAll(): Promise<IPessoaResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IPessoaDTO, id: string, codigoEndereco: string): Promise<string[]>
}

export interface IPessoaDTO {
  nome: string
  cpf: string
  sexo: string
  dataCadastro: Date
  observacoes: string | null
  telefone: string | null
  telefoneWpp: string | null
  email: string
  contato: string | null
  telefoneContato: string | null
  ativo: boolean
  dataNascimento: Date | null
  usuarioCadastro: string
}

export interface IPessoaResponse extends IPessoaDTO {
  id: string
}

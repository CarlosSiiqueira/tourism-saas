import { IIndex } from "./Helper"

export interface IPessoa {
  index(data: IIndex): Promise<{ count: number, rows: IPessoaResponse[] }>
  create(data: IPessoaDTO, codigoEndereco: string): Promise<string>
  find(id: string): Promise<IPessoaResponse | null>
  findAll(): Promise<IPessoaResponse[]>
  findByCpf(cpf: string): Promise<IPessoaResponse | null>
  delete(id: string): Promise<string[]>
  update(data: IPessoaDTO, id: string, codigoEndereco: string): Promise<string[]>
  relatorioClientes(data: IIndex): Promise<any>
}

export interface IPessoaDTO {
  nome: string
  cpf: string
  sexo: string
  observacoes: string | null
  telefone: string | null
  telefoneWpp: string | null
  email: string
  contato: string | null
  telefoneContato: string | null
  dataNascimento: Date | null
  usuarioCadastro: string
  rg: string | null
  emissor: string | null
}

export interface IPessoaResponse extends IPessoaDTO {
  id: string
}

export interface IPessoaReportResponse extends IPessoaResponse {
  Transacoes: Array<{
    id: string
    tipo: number
    valor: number
    vistoAdmin?: boolean
    data: Date
    efetivado?: boolean
    observacao?: string | null
    ativo: boolean
    numeroComprovanteBancario?: string | null
    dataPrevistaRecebimento: Date
    idWP?: number | null
    codigoPessoa?: string | null
    codigoFornecedor?: string | null
    codigoExcursao?: string | null
    codigoProduto?: string | null
    codigoPacote?: string | null
    codigoContaBancaria?: string | null
    codigoFormaPagamento: string
    codigoCategoria?: string | null
    usuarioCadastro: string
    Excursao: {
      id: string
      nome: string
      dataInicio: Date
      dataFim: Date
      observacoes: string | null
      dataCadastro: Date
      ativo: boolean
      gerouFinanceiro: boolean
      vagas: number
      codigoPacote: string
      usuarioCadastro: string
      valor: number
    } | null
    Pacotes: {
      id: string
      nome: string
      descricao: string
      ativo: boolean
      origem: number
      tipoTransporte: number
      urlImagem: string | null
      urlImgEsgotado: string | null
      idWP: number | null
      destino: string
      categoria: number | null
      codigoDestino: string | null
      usuarioCadastro: string
    } | null
  }>
  valorTotal?: number | null
  count?: number | null
}

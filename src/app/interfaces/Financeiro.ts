import { IIndex } from "./Helper"

export interface IFinanceiro {
  index(data: IIndex): Promise<{ count: number, rows: IFinanceiroIndexResponse[] }>
  create(data: IFinanceiroDTO): Promise<string[]>
  find(id: string): Promise<IFinanceiroResponse | null>
  findAll(): Promise<IFinanceiroResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IFinanceiroDTO, id: string): Promise<string[]>
}

export interface IFinanceiroDTO {
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
  codigoFormaPagamento: string
  usuarioCadastro: string
}

export interface IFinanceiroResponse extends IFinanceiroDTO {
  id: string
}

export interface IFinanceiroIndexResponse extends IFinanceiroDTO {
  id: string,
  Pessoas?: {
    id: string
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
  } | null,
  Fornecedor?: {
    id: string
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
  } | null,
  Excursao?: {
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
  } | null,
  Pacotes?: {
    id: string
    nome: string
    valor: number
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
  } | null,
  Usuarios: {
    id: string
    nome: string
    username: string
    password: string
    dataCadastro: Date
    usuarioCadastro: string | null
    tipo: number
    email: string
    ativo: boolean
    comissao: number | null
    meta: number | null
  },
  Produtos?: {
    id: string
    nome: string
    estoque: number
    dataCompra?: Date | null
    ativo: boolean
    codigoFornecedor: string
    usuarioCadastro: string
  } | null,
  FormaPagamento: {
    id: string
    nome: string
    dataCadastro: Date
    taxa: number
    qtdDiasRecebimento: number
    ativo: boolean
    codigoContaBancaria: string
    usuarioCadastro: string
    ContaBancaria: {
      id: string
      nome: string
      ativo: boolean
      saldo: number
      dataCadastro: Date
      usuarioCadastro: string
    }

  }
}

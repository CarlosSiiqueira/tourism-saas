import { IIndex } from "./Helper"

export interface IFinanceiro {
  index (data: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[] }>
  create (data: IFinanceiroDTO): Promise<string>
  find (id: string): Promise<IFinanceiroResponse>
  findAll (): Promise<IFinanceiroResponse[]>
  delete (id: string): Promise<string>
  update (data: IFinanceiroDTO, id: string): Promise<string>
  setVistoAdmin (visto: boolean, id: string): Promise<string[]>
  checkVistoAdmin (id: string): Promise<boolean>
  efetivaDesfetiva (id: string, acao: boolean): Promise<string[]>
  relatorioFinanceiroCliente (data: IIndex, idCliente: string): Promise<{ sum: number, count: number, rows: IFinanceiroResponse[] }>
  relatorioFinanceiroCategoria (data: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }>
  relatorioFinanceiroExcursoes (data: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }>
  relatorioFinanceiroFornecedor (data: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], despesas: number }>
  relatorioFinanceiroPacote (data: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }>
  relatorioFinanceiroVenda (data: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], vendas: number }>
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
  idWP?: number | null
  codigoPessoa?: string | null
  codigoFornecedor?: string | null
  codigoExcursao?: string | null
  codigoProduto?: string | null
  codigoPacote?: string | null
  codigoContaBancaria?: string | null
  codigoFormaPagamento: string
  codigoCategoria?: string | null
  idReserva?: string | null
  usuarioCadastro: string
}

export interface IFinanceiroResponse extends IFinanceiroDTO {
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
    valor: number
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
    descricao: string
    ativo: boolean
    origem: number
    tipoTransporte: number
    urlImagem: string | null
    urlImgEsgotado: string | null
    idWP: number | null
    categoria: number | null
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
    usuarioCadastro: string
  }
  ContaBancaria: {
    id: string
    nome: string
    ativo: boolean
    saldo: number
    dataCadastro: Date
    usuarioCadastro: string
  } | null
  CategoriaTransacao: {
    id: string
    nome: string
    tipo: number
    codigoUsuario: string
    codigoSubCategoria: string
    SubCategoria: {
      id: string
      nome: string
      codigoUsuario: string
    }
  } | null
  Reservas: {
    id: string,
    reserva: number,
    status: boolean,
    codigoUsuario: string | null,
    desconto: number
    plataforma: number
  } | null
}

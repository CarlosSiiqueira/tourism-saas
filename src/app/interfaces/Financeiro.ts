export interface IFinanceiro {
  create(data: IFinanceiroDTO): Promise<string[]>
  find(id: string): Promise<IFinanceiroResponse | null>
  findAll(): Promise<IFinanceiroResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IFinanceiroDTO, id: string): Promise<string[]>
}

export interface IFinanceiroDTO {
  tipo: number
  valor: number
  vistoAdmin: boolean
  data: Date
  efetivado: boolean
  observacao: string | null
  ativo: boolean
  numeroComprovanteBancario: string | null
  dataPrevistaRecebimento: Date
  codigoPessoa: string
  codigoFornecedor: string
  codigoExcursao: string | null
  codigoProduto: string | null
  codigoPacote: string | null
  codigoFormaPagamento: string
  usuarioCadastro: string
}

export interface IFinanceiroResponse extends IFinanceiroDTO {
  id: string
}

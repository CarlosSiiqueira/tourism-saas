export interface IVendas {
  create(data: IVendasDTO): Promise<string[]>
  find(id: string): Promise<IVendasResponse | null>
  findAll(): Promise<IVendasResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IVendasDTO, id: string): Promise<string[]>
  efetivar(id: string): Promise<IVendasResponse>
  desEfetivar(id: string): Promise<IVendasResponse>
}

export interface IVendasDTO {
  valorTotal: number
  valorUnitario: number
  qtd: number
  efetivada: boolean
  origem: number
  codigoCliente: string
  codigoFormaPagamento: string
  codigoProduto: string | null
  codigoExcursao: string | null
  usuarioCadastro: string
}

export interface IVendasResponse extends IVendasDTO {
  id: string
}

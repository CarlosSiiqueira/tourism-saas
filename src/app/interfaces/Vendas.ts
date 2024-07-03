export interface IVendas {
  create(data: IVendasDTO): Promise<string[]>
  find(id: string): Promise<IVendasResponse | null>
  findAll(): Promise<IVendasResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IVendasDTO, id: string): Promise<string[]>
}

export interface IVendasDTO {
  valor: number
  tipo: number
  qtd: number
  efetivada: boolean
  origem: number
  codigoCliente: string
  codigoFormaPagamento: string
  codigoProduto: string | null
  codigoPacote: string | null
  usuarioCadastro: string
}

export interface IVendasResponse extends IVendasDTO {
  id: string
}

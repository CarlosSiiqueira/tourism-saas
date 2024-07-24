export interface IIndex {
  orderBy?: string
  order?: string | "asc" | "desc"
  skip?: number,
  take?: number,
  filter?: IFilter | {}
}

export interface IFilter {
  [key: string]: string
}

export interface IFinanceiroHookArgs {
  codigoPessoa: string | null
  codigoExcursao?: string | null
  codigoFormaPagamento: string
  Pacote: {
    id: string
    idWP: number
  }
  total: number
  order_key: string
  id: number
  line_items: [{
    id: number
    name: string
    product_id: number
    quantity: number
    subtotal: number
    subtotal_tax: number
    total: number
    total_tax: number
    price: number
    image: {
      src: string
    }
  }]
}

export interface IPacoteHookArgs {
  line_items: [{
    id: number
    name: string
    product_id: number
    quantity: number
    subtotal: number
    subtotal_tax: number
    total: number
    total_tax: number
    price: number
    image: {
      src: string
    }
  }]
}

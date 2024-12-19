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

export interface IFinanceiroFilter {
  Pessoas?: {
    nome: {
      contains: string
      mode: string
    }
  }
  Fornecedor?: {
    nome: {
      contains: string,
      mode: string
    }

  }
  Excursao?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  Produtos?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  FormaPagamento?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  Usuarios?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  observacao?: {
    contains: string,
    mode: string
  }
  ContaBancaria?: {
    nome: {
      contains: string,
      mode: string
    }
  }
  valor?: number
  data?: {
    gte: Date;
  } | { lte: Date }
  efetivado?: boolean
  codigoContaBancaria?: {
    in: string[]
  }
}

export interface IEmail {
  to: string
  subject: string
  text: string | null
}

export interface IReservaFilter {
  nome?: {
    contains: string
    mode: string
  }
  Usuario?: {
    nome: {
      contains: string
      mode: string
    }
  }
  reserva?: {
    equals: number
  }
  status?: boolean
}

export interface PagarmeLinkRequestBody {
  is_building: boolean,
  payment_settings: {
    credit_card_settings: {
      operation_type: string,
      installments: Array<
        {
          number: number,
          total: number
        }>
    },
    accepted_payment_methods: string[]
  },
  cart_settings: {
    items: PagarmeLinkItem[];
  },
  name: string,
  type: string,
  customer_settings: {
    customer?: {
      type: string,
      email: string,
      name: string,
      document: string, // CPF, CNPJ, PASSPORT
      document_type: string,
      phones?: {
        home_phone?: {
          country_code: string,
          area_code: string,
          number: string
        },
        mobile_phone?: {
          country_code: string,
          area_code: string,
          number: string
        }
      }
    }
  },
  layout_settings: {
    image_url: string,
    primary_color: string
  }
}

export interface PagarmeLinkItem {
  amount: number
  name: string,
  description: string,
  default_quantity: number
}

export interface OpcionalReserva {
  nome: string,
  valor: number,
  quantidade: number
}
import { IIndex } from "./Helper"

export interface IReserva {
  index (data: IIndex): Promise<{
    count: number
    rows: IReservaResponse[]
  }>
  create (data: IReservaDTO): Promise<string>
  find (id: string): Promise<IReservaResponse>
  findAll (): Promise<IReservaResponse[]>
  delete (id: string): Promise<string>
  update (data: IReservaDTO, id: string): Promise<string[]>
  setConfirm (id: string, status: boolean): Promise<string>
  setOpcionais (opcionais: string[], id: string): Promise<string[]>
  updatePaymentLinkId (id: string, idPaymentLink: string): Promise<string>
}

export interface IReservaDTO {
  reserva?: number
  codigoUsuario: string | null
  passageiros: string[]
  idExcursao: string
  desconto: number
  plataforma?: number
  localEmbarqueId: string
  criancasColo: number
}

export interface IReservaResponse {
  id: string,
  reserva: number,
  status: boolean,
  codigoUsuario: string | null,
  desconto: number
  plataforma: number
  dataCadastro: Date
  Pessoa: {
    id: string,
    nome: string,
    cpf: string,
    rg: string | null
    email: string
  }[],
  Excursao: {
    id: string,
    nome: string,
    dataInicio: Date,
    dataFim: Date,
    valor: number
  },
  Usuario: {
    nome: string
  } | null
  LocalEmbarque: {
    id: string
    nome: string
    horaEmbarque: string
  },
  Transacoes?: {
    id: string
    valor: number
    FormaPagamento: {
      id: string
      nome: string,
      creditCard: boolean
    }
  }[]
  Opcionais: {
    id: string,
    qtd: number,
    Produto: {
      id: string,
      nome: string
    }
  }[]
  ExcursaoPassageiros: {
    id: string
    idExcursao: string
    idPassageiro: string
    localEmbarque: string
    reserva: string
    dataCadastro: Date
    Pessoa: {
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
      rankingClientesId?: string | null
    }
    LocalEmbarque: {
      nome: string
      observacoes: string | null
      horaEmbarque: string
      dataCadastro: Date
      codigoEndereco: string
      usuarioCadastro: string
      ativo: boolean
    }
  }[]
}

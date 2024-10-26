import { IIndex } from "./Helper"

export interface IExcursaoPassageiros {
  index (data: IIndex, idExcursao: string): Promise<{
    count: number,
    rows: IExcursaoPassageirosResponse[]
  }>
  create (data: IExcursaoPassageirosDTO): Promise<string[]>
  find (idExcursao: string): Promise<IExcursaoPassageirosResponse[]>
  findAll (): Promise<IExcursaoPassageirosResponse[]>
  listPassageiros (idExcursao: string): Promise<any>
  findByIdPessoa (idsPassageiros: string[], idExcursao: string): Promise<IExcursaoPassageirosResponse[]>
  delete (idPassageiro: string, idExcursao: string): Promise<string[]>
  deleteMultiple (idPassageiros: Array<string>, idExcursao: string): Promise<string[]>
  countTripsByPassenger (idPessoa: string): Promise<number>
}

export interface IExcursaoPassageirosDTO {
  idExcursao: string
  idPassageiro: string
  localEmbarque: string
  reserva: string
}

export interface IExcursaoPassageirosResponse extends IExcursaoPassageirosDTO {
  id: string
  LocalEmbarque: {
    nome: string
    observacoes: string | null
    horaEmbarque: string
    dataCadastro: Date
    codigoEndereco: string
    usuarioCadastro: string
    ativo: boolean
  },
  Pessoa: {
    id: string,
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
    rankingClientesId?: string | null
    rg?: string | null
    emissor?: string | null
  },
  Excursao: {
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
  },
  Reservas: {
    id: string,
    reserva: number,
    status: boolean,
    codigoUsuario: string | null,
    desconto: number
    plataforma: number
    Opcionais: {
      id: string
      qtd: number
      idReserva: string,
      Produto: {
        id: string
        nome: string
      }
    }[]
  }
}

export interface IExcursaoPassageirosListResponse {
  id: string
  Pessoa: {
    id: string
    nome: string
  }
  reserva: number
}

export interface IExcursaoPassageirosEmbarqueReponse extends IExcursaoPassageirosDTO {
  embarcou: boolean
  hasBoarded: string
  horaEmbarque: string
  LocalEmbarque: {
    nome: string
    observacoes: string | null
    horaEmbarque: string
    dataCadastro: Date
    codigoEndereco: string
    usuarioCadastro: string
    ativo: boolean
  },
}

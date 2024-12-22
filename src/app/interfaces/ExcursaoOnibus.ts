import { IIndex } from "./Helper"

export interface IExcursaoOnibus {
  index (idExcursao: string, data: IIndex): Promise<{ count: number, rows: IExcursaoOnibusResponse[] }>
  create (data: IExcursaoOnibusDTO): Promise<string>
  find (idCadeira: string): Promise<IExcursaoOnibusResponse>
  findAll (idExcursao: string): Promise<IExcursaoOnibusResponse[]>
  update (data: IExcursaoOnibusDTO, id: string): Promise<IExcursaoOnibusResponse>
  deleteManyByIdPassageiro (idPassageiros: string[], idExcursao: string): Promise<string[]>
}

export interface IExcursaoOnibusDTO {
  numeroCadeira: string
  dataCadastro: Date
  codigoPassageiro: string
  codigoExcursao: string
  usuarioCadastro: string
}

export interface IExcursaoOnibusResponse extends IExcursaoOnibusDTO {
  id: string
  Passageiro: {
    id: string
    idExcursao: string
    idPassageiro: string
    localEmbarque: string
    reserva: string,
    Pessoa: {
      id: string,
      nome: string
    },
    LocalEmbarque: {
      id: string
      nome: string
      observacoes: string | null
      horaEmbarque: string
      dataCadastro: Date
      codigoEndereco: string
      usuarioCadastro: string
      ativo: boolean
    }
    Reservas: {
      id: string
      reserva: number
      codigoUsuario: string | null
      idExcursao: string
      desconto: number
      plataforma?: number
      localEmbarqueId: string
      criancasColo: number
    }
  }
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
    qtdMinVendas: number
  }
}

import { IIndex } from "./Helper"

export interface IOpcionalEmbarque {
  index(data: IIndex, id: string): Promise<{
    count: number
    rows: IOpcionalEmbarqueResponse[]
  }>
  create(data: IOpcionalEmbarqueDTO): Promise<string>
  find(id: string): Promise<IOpcionalEmbarqueResponse>
  findAll(): Promise<IOpcionalEmbarqueResponse[]>
  delete(id: string): Promise<IOpcionalEmbarqueResponse>
  update(data: IOpcionalEmbarqueDTO, id: string): Promise<IOpcionalEmbarqueResponse>
  findByPessoaExcursao(idPassageiro: string, idExcursao: string): Promise<IOpcionalEmbarqueResponse>
}

export interface IOpcionalEmbarqueDTO {
  id: string
  embarcou: boolean
  data: Date
  idOpcional: string
  idPassageiro: string
}

export interface IOpcionalEmbarqueResponse extends IOpcionalEmbarqueDTO {
  id: string
  Passageiro: {
    id: string
    idExcursao: string
    idPassageiro: string
    localEmbarque: string
    reserva: string
    Pessoa: {
      id: string
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
    Reservas: {
      reserva?: number
      codigoUsuario: string | null
      idExcursao: string
      desconto: number
      plataforma?: number
      localEmbarqueId: string
      criancasColo: number
    }
  }
}

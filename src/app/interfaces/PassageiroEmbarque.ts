import { IIndex } from "./Helper"

export interface IPassageiroEmbarque {
  index(data: IIndex): Promise<{
    count: number
    rows: IPassageiroEmbarqueResponse[]
  }>
  create(data: IPassageiroEmbarqueDTO): Promise<string>
  find(id: string): Promise<IPassageiroEmbarqueResponse>
  findAll(): Promise<IPassageiroEmbarqueResponse[]>
  findByExcursao(idExcursao: string): Promise<IPassageiroEmbarqueResponse[]>
  embarqueDesembarque(data: IPassageiroEmbarqueResponse): Promise<string[]>
  embarqueQRCode(data: IPassageiroEmbarqueDTO, id: string): Promise<string[]>
}

export interface IPassageiroEmbarqueDTO {
  embarcou: boolean
  horaEmbarque: string
  codigoLocalEmbarque: string
  codigoExcursao: string
  codigoPassageiro: string
  usuarioCadastro: string
}

export interface IPassageiroEmbarqueResponse extends IPassageiroEmbarqueDTO {
  id: string
}

export interface IPassageiroEmbarqueIndexResponse extends IPassageiroEmbarqueResponse {
  LocalEmbarque: {
    id: string
    nome: string
    observacoes: string | null
    horaEmbarque: string
    ativo: boolean
    codigoEndereco: string
    usuarioCadastro: string
    dataCadastro: Date
  },
  Passageiro: {
    id: string
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
      ativo: boolean
      dataNascimento: Date | null
      usuarioCadastro: string
      dataCadastro: Date
    }
  }
}

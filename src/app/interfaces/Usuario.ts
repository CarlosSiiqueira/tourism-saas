import { IIndex } from "./Helper"

export interface IUsuario {
  index (data: IIndex): Promise<{ count: number, rows: IUsuarioResponse[] }>
  create (data: IUsuarioDTO): Promise<string>
  find (id: string): Promise<IUsuarioResponse | null>
  findAll (): Promise<IUsuarioResponse[]>
  delete (id: string): Promise<IUsuarioResponse>
  update (data: IUsuarioDTO, id: string): Promise<IUsuarioResponse>
  login (username: string, password: string): Promise<IUsuarioResponse>
  loginUserClient (username: string, password: string): Promise<IUsuarioClientResponse>
  changePassword (id: string, data: IUsuarioChangePassword): Promise<IUsuarioResponse>
}


export interface IUsuarioDTO {
  nome: string
  username: string
  password: string
  usuarioCadastro: string | null
  tipo: number
  email: string
  ativo: boolean
  comissao: number | null
  meta: number | null
}

export interface IUsuarioResponse extends IUsuarioDTO {
  id: string
}

export interface IUsuarioLogin extends IUsuarioDTO {
  username: string
  password: string
}

export interface IUsuarioFilter {
  nome?: {
    contains: string,
    mode: string
  }
  status?: boolean
}

export interface IUsuarioChangePassword {
  password: string
  confirmationPassword: string
}

export interface IUsuarioClientResponse {
  id: string
  nome: string
  username: string
  email: string
}

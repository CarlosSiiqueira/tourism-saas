import { IIndex } from "./Helper"

export interface IContaBancaria {
  index(data: IIndex): Promise<{
    count: number
    rows: IContaBancariaResponse[]
  }>
  create(data: IContaBancariaDTO): Promise<string[]>
  find(id: string): Promise<IContaBancariaResponse>
  findAll(): Promise<IContaBancariaResponse[]>
  delete(id: string): Promise<string>
  update(data: IContaBancariaDTO, id: string): Promise<string[]>
  setSaldo(id: string, saldo: number): Promise<IContaBancariaResponse>
}

export interface IContaBancariaDTO {
  nome: string
  ativo: boolean
  saldo: number
  dataCadastro: Date
  usuarioCadastro: string
}

export interface IContaBancariaResponse extends IContaBancariaDTO {
  id: string
}

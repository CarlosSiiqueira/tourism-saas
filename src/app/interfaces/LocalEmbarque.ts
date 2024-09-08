export interface ILocalEmbarque {
  create(data: ILocalEmbarqueDTO): Promise<string>
  find(id: string): Promise<ILocalEmbarqueResponse | null>
  findAll(): Promise<ILocalEmbarqueResponse[]>
  delete(id: string): Promise<ILocalEmbarqueResponse>
  update(data: ILocalEmbarqueDTO, id: string): Promise<ILocalEmbarqueResponse>
}


export interface ILocalEmbarqueDTO {
  nome: string
  observacoes: string | null
  horaEmbarque: string
  dataCadastro: Date
  codigoEndereco: string
  usuarioCadastro: string
  ativo: boolean
}

export interface ILocalEmbarqueResponse extends ILocalEmbarqueDTO {
  id: string
}

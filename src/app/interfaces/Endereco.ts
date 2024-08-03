export interface IEndereco {
  create(data: IEnderecoDTO): Promise<string>
  find(id: string): Promise<IEnderecoResponse | null>
  findAll(): Promise<IEnderecoResponse[]>
  delete(id: string): Promise<string[]>
  update(data: IEnderecoDTO, id: string): Promise<string[]>
  findByCepAndNumber(cep: string, numero: string): Promise<IEnderecoResponse | null>
}

export interface IEnderecoDTO {
  logradouro: string
  numero: string
  complemento: string | null
  cep: string
  cidade: string
  uf: string
  bairro: string
}

export interface IEnderecoResponse extends IEnderecoDTO {
  id: string
}

import { injectable, inject } from "tsyringe";
import { EnderecoRepository } from "../repositories/endereco.repository";

interface Address {
  logradouro: string
  numero: string
  complemento: string | null
  cep: string
  cidade: string
  uf: string
  bairro: string
}

@injectable()
export class EnderecoService {

  constructor(
    @inject("EnderecoRepository")
    private enderecoRepository: EnderecoRepository
  ) { }

  findOrCreateAddress = async ({
    logradouro,
    numero,
    complemento,
    cep,
    cidade,
    uf,
    bairro
  }: Address): Promise<string> => {

    try {
      const endereco = await this.enderecoRepository.findExact({
        logradouro,
        numero,
        complemento,
        cep,
        cidade,
        uf,
        bairro
      })

      if (endereco) {
        return endereco.id
      }

      const newEndereco = await this.enderecoRepository.create({
        logradouro,
        numero,
        complemento,
        cep,
        cidade,
        uf,
        bairro
      })

      return newEndereco

    } catch (error) {
      return 'erro ao gerar endereço'
    }
  }
}

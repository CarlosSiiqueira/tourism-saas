import { injectable, inject } from "tsyringe";
import { EnderecoRepository } from "../repositories/endereco.repository";

interface Address {
  id: string | null
  logradouro: string
  numero: string
  complemento: string | null
  cep: string
  cidade: string
  uf: string
}

@injectable()
export class EnderecoService {

  constructor(
    @inject("EnderecoRepository")
    private enderecoRepository: EnderecoRepository
  ) { }

  findOrCreateAddress = async ({
    id = null,
    logradouro,
    numero,
    complemento = null,
    cep,
    cidade,
    uf,
  }: Address): Promise<string> => {

    try {
      let endereco;
      let codigoEndereco: string = '';

      if (id) {
        codigoEndereco = id
      } else {

        endereco = await this.enderecoRepository.findByCepAndNumber(cep, numero)

        if (endereco) {
          codigoEndereco = endereco.id
        }

        if (!codigoEndereco) {
          const endereco = await this.enderecoRepository.create({
            logradouro,
            numero,
            complemento,
            cep,
            cidade,
            uf
          })

          codigoEndereco = endereco
        }
      }

      return codigoEndereco

    } catch (error) {
      return 'erro ao gerar endereço'
    }
  }


}
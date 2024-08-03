import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IEndereco, IEnderecoDTO, IEnderecoResponse } from "../interfaces/Endereco"

class EnderecoRepository implements IEndereco {

  private prisma = prismaManager.getPrisma()

  create = async ({
    logradouro,
    numero,
    complemento = '',
    cep,
    cidade,
    bairro,
    uf }: IEnderecoDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const endereco = await this.prisma.endereco.create({
        data: {
          id,
          logradouro,
          numero,
          complemento,
          cep,
          cidade,
          bairro,
          uf
        }
      })

      return id

    } catch (error) {
      throw new Warning("Erro ao inserir endereço", 400);
    }
  }

  find = async (id: string): Promise<IEnderecoResponse | null> => {

    const endereco = await this.prisma.endereco.findUnique({
      where: {
        id
      }
    })

    if (!endereco) {
      throw new Warning("Endereco não encontrado", 400)
    }

    return endereco

  }

  findAll = async (): Promise<IEnderecoResponse[]> => {

    const enderecos = await this.prisma.endereco.findMany()

    if (!enderecos) {
      throw new Warning("Sem Enderecos registradas na base", 400)
    }

    return enderecos
  }

  findByCepAndNumber = async (cep: string, numero: string): Promise<IEnderecoResponse | null> => {

    const endereco = await this.prisma.endereco.findFirst({
      where: {
        cep,
        numero
      }
    })

    return endereco
  }

  update = async ({
    logradouro,
    numero,
    complemento,
    cep,
    cidade,
    bairro,
    uf }: IEnderecoDTO, id: string): Promise<string[]> => {

    try {

      const endereco = await this.prisma.endereco.update({
        data: {
          logradouro,
          numero,
          complemento,
          cep,
          cidade,
          uf,
          bairro
        },
        where: {
          id
        }
      })

      return ['Endereco atualizado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar Endereco', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    const endereco = await this.prisma.endereco.delete({
      where: {
        id
      }
    })

    if (!endereco) {
      return ['Não foi possível excluir o Endereco']
    }

    throw new Warning('Endereco excluido com sucesso', 400)
  }
}

export { EnderecoRepository }

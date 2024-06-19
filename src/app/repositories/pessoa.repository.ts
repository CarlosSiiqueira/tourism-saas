import prismaManager from "../database/database";
import { IPessoa, IPessoaDTO, IPessoaResponse } from "../interfaces/Pessoa";
import { dateValidate } from "../../shared/helper/date";
import { Warning } from "../errors";

class PessoaRepository implements IPessoa {

  private prisma = prismaManager.getPrisma()

  create = async ({
    nome,
    cpf,
    sexo,
    observacoes = '',
    telefone = '',
    telefoneWpp = '',
    email,
    contato = '',
    telefoneContato = '',
    dataNascimento = new Date(),
    usuarioCadastro }: IPessoaDTO, codigoEndereco: string): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      if (dataNascimento) {
        dataNascimento = dateValidate(dataNascimento)
      }

      const pessoa = await this.prisma.pessoas.create({
        data: {
          id,
          nome,
          cpf,
          sexo,
          observacoes,
          telefone,
          telefoneWpp,
          email,
          contato,
          telefoneContato,
          dataNascimento,
          usuarioCadastro,
          Endereco: {
            connect: {
              id: codigoEndereco
            }
          }
        }
      })

      return ['Pessoa inserida com sucesso']

    } catch (error) {
      throw new Warning('Erro ao inserir pessoa', 400)
    }

  }

  find = async (id: string): Promise<IPessoaResponse | null> => {

    const pessoa = await this.prisma.pessoas.findFirst({
      where: {
        id
      },
      include: {
        Endereco: true
      }
    })

    if (!pessoa) {
      throw new Warning("Pessoa não encontrada", 400)
    }

    return pessoa

  }

  findAll = async (): Promise<IPessoaResponse[]> => {

    const pessoas = await this.prisma.pessoas.findMany({
      where: {
        ativo: true
      },
      include: {
        Endereco: true
      }
    })

    if (!pessoas) {
      throw new Warning("Sem pessoas registradas na base", 400)
    }

    return pessoas
  }

  update = async ({
    nome,
    cpf,
    sexo,
    observacoes = '',
    telefone = '',
    telefoneWpp = '',
    email,
    contato = '',
    telefoneContato = '',
    dataNascimento = new Date(),
    usuarioCadastro }: IPessoaDTO, id: string): Promise<string[]> => {

    try {

      if (dataNascimento) {
        dataNascimento = dateValidate(dataNascimento)
      }

      const pessoa = await this.prisma.pessoas.update({
        data: {
          nome,
          cpf,
          sexo,
          dataCadastro: new Date(),
          observacoes,
          telefone,
          telefoneWpp,
          email,
          contato,
          telefoneContato,
          dataNascimento,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return ['Pessoa atualizada com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar pessoa', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    const pessoa = await this.prisma.pessoas.update({
      data: {
        ativo: false
      },
      where: {
        id
      }
    })

    if (!pessoa) {
      throw new Warning('Não foi possível excluir pessoa', 400)
    }

    return ['Pessoa excluida com sucesso']
  }
}

export { PessoaRepository }

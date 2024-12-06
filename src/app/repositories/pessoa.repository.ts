import crypto from 'crypto';
import prismaManager from "../database/database";
import { IPessoa, IPessoaDeleteResponse, IPessoaDTO, IPessoaFilter, IPessoaReportResponse, IPessoaResponse } from "../interfaces/Pessoa";
import { dateValidate } from "../../shared/helper/date";
import { Warning } from "../errors";
import { IIndex } from "../interfaces/Helper";

class PessoaRepository implements IPessoa {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IPessoaResponse[] }> => {

    const where = {
      ativo: true
    }

    let filterOR: IPessoaFilter[] = []

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          filterOR.push(
            {
              nome: {
                contains: value,
                mode: "insensitive"
              }
            },
            {
              email: {
                contains: value,
                mode: "insensitive"
              }
            },
            {
              cpf: {
                contains: value,
                mode: "insensitive"
              }
            }
          )
          break;

        case 'status':
          if (value !== 'all') {
            Object.assign(where, {
              ativo: parseInt(value) == 1 ? true : false
            })
          }
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.pessoas.count({ where }),
      this.prisma.pessoas.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Endereco: true,
          Ranking: true,
          CreditoClientes: {
            include: {
              Reserva: true
            }
          }
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
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
    rg,
    emissor,
    rankingClientesId }: IPessoaDTO, codigoEndereco: string | null): Promise<string> => {

    try {

      const id = crypto.randomUUID()
      let addressConnect = {}

      if (dataNascimento) {
        dataNascimento = dateValidate(dataNascimento)
      }

      if (codigoEndereco) {
        addressConnect = {
          Endereco: {
            connect: {
              id: codigoEndereco
            }
          }
        }
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
          ativo: true,
          rg,
          emissor,
          rankingClientesId,
          ...addressConnect
        }
      })

      return id
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
        Endereco: true,
        Ranking: true
      }
    })

    if (!pessoas) {
      throw new Warning("Sem pessoas registradas na base", 400)
    }

    return pessoas
  }

  findByCpf = async (cpf: string): Promise<IPessoaResponse | null> => {

    const pessoa = await this.prisma.pessoas.findFirst({
      where: {
        cpf
      }
    })

    return pessoa
  }

  update = async ({
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
    rg,
    emissor,
    rankingClientesId }: IPessoaDTO, id: string, codigoEndereco: string): Promise<IPessoaResponse> => {

    try {
      let endereco = {}

      if (dataNascimento) {
        dataNascimento = dateValidate(dataNascimento)
      }

      if (codigoEndereco) {
        await this.prisma.pessoas.update({
          where: {
            id
          },
          data: {
            Endereco: {
              set: []
            }
          }
        })
        endereco = {
          Endereco: {
            connect: {
              id: codigoEndereco
            }
          }
        }
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
          usuarioCadastro,
          rg,
          emissor,
          rankingClientesId,
          ...endereco
        },
        where: {
          id
        }
      })

      return pessoa

    } catch (error) {
      throw new Warning('Erro ao atualizar pessoa', 400)
    }
  }

  delete = async (id: string): Promise<IPessoaDeleteResponse> => {

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

    return pessoa
  }

  updateRank = async (id: string, idRank: string): Promise<string> => {

    const pessoa = await this.prisma.pessoas.update({
      data: {
        rankingClientesId: idRank
      },
      where: {
        id
      }
    })

    if (!pessoa) {
      throw new Warning('Não foi possível alterar rank do cliente', 400)
    }

    return 'Rank alterado com sucesso'
  }
}

export { PessoaRepository }

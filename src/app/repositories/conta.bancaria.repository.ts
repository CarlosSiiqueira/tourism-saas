import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IContaBancaria, IContaBancariaDTO, IContaBancariaResponse } from "../interfaces/ContaBancaria"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class ContaBancariaRepository implements IContaBancaria {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IContaBancariaResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          Object.assign(where, {
            OR: [
              {
                nome: {
                  contains: value,
                  mode: "insensitive"
                }
              },
              {
                Usuarios: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              }
            ]
          })
          break;

        case 'saldo':
          Object.assign(where, {
            OR: [
              {
                saldo: {
                  equals: parseInt(value),
                  // mode: "insensitive"
                }
              }
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.contaBancaria.count({ where }),
      this.prisma.contaBancaria.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        select: {
          id: true,
          nome: true,
          ativo: true,
          saldo: true,
          dataCadastro: true,
          usuarioCadastro: true,
          Usuarios: {
            select: {
              nome: true,
            }
          }
        }
      })
    ])

    return { count, rows }

  }

  create = async ({
    nome,
    saldo = 0,
    usuarioCadastro
  }: IContaBancariaDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.contaBancaria.create({
        data: {
          id,
          nome,
          saldo,
          usuarioCadastro
        }
      })

      return ['Conta bancária cadastrada com sucesso!']

    } catch (error) {
      throw new Warning('Erro ao criar conta bancária', 400)
    }
  }

  find = async (id: string): Promise<IContaBancariaResponse> => {

    const contaBancaria = await this.prisma.contaBancaria.findUnique({
      where: {
        id
      },
      include: {
        Usuarios: true
      }
    })

    if (!contaBancaria) {
      throw new Warning("Conta não encontrada", 400);
    }

    return contaBancaria
  }

  findAll = async (): Promise<IContaBancariaResponse[]> => {

    const contasBancarias = await this.prisma.contaBancaria.findMany({
      where: {
        ativo: true
      },
      include: {
        Usuarios: true
      }
    })

    if (!contasBancarias) {
      throw new Warning("Sem contas cadastradas na base", 400)
    }

    return contasBancarias
  }

  delete = async (id: string): Promise<string> => {

    const contaBancaria = await this.prisma.contaBancaria.delete({
      where: {
        id: id
      }
    })

    if (!contaBancaria) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id
  }

  update = async ({
    nome,
    saldo,
    ativo,
    usuarioCadastro
  }: IContaBancariaDTO, id: string): Promise<string[]> => {

    const contaBancaria = await this.prisma.contaBancaria.update({
      data: {
        nome: nome,
        saldo: saldo,
        ativo: ativo,
        dataCadastro: new Date(),
        usuarioCadastro: usuarioCadastro
      },
      where: {
        id: id
      }
    })

    if (!contaBancaria) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro Atualizado com sucesso'];
  }

  setSaldo = async (id: string, saldo: number): Promise<IContaBancariaResponse> => {

    const conta = await this.prisma.contaBancaria.update({
      where: {
        id
      },
      data: {
        saldo
      }
    })

    return conta
  }

}

export { ContaBancariaRepository }

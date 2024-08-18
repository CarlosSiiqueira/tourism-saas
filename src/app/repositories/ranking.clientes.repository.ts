import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IIndex } from "../interfaces/Helper"
import { IRankingCliente, IRankingClienteDTO, IRankingClienteResponse } from "../interfaces/RankingCliente"
import crypto from 'crypto'

class RankingClientesRepository implements IRankingCliente {

  private prisma = prismaManager.getPrisma()

  index = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex): Promise<{ count: number; rows: IRankingClienteResponse[] }> => {

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
                Fornecedor: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              }
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.rankingClientes.count({ where }),
      this.prisma.rankingClientes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    qtdMinViagens,
    qtdMaxViagens,
    usuariosId }: IRankingClienteDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const ranking = await this.prisma.rankingClientes.create({
        data: {
          id,
          nome,
          qtdMinViagens,
          qtdMaxViagens,
          usuariosId
        }
      })

      return id
    } catch (error) {
      throw new Warning("Erro ao inserir ranking", 400)
    }
  }

  find = async (id: string): Promise<IRankingClienteResponse | null> => {

    const ranking = await this.prisma.rankingClientes.findUnique({
      where: {
        id
      }
    })

    if (!ranking) {
      throw new Warning("Ranking não encontrado", 400)
    }

    return ranking
  }

  findAll = async (): Promise<IRankingClienteResponse[]> => {

    const rankings = await this.prisma.rankingClientes.findMany()

    if (!rankings) {
      throw new Warning("Sem Rankings registrados na base", 400)
    }

    return rankings
  }

  update = async ({
    nome,
    qtdMinViagens,
    qtdMaxViagens,
    usuariosId }: IRankingClienteDTO, id: string): Promise<string> => {

    try {

      const ranking = await this.prisma.rankingClientes.update({
        data: {
          nome,
          qtdMinViagens,
          qtdMaxViagens,
          usuariosId
        },
        where: {
          id
        }
      })

      return id
    } catch (error) {
      throw new Warning('Erro ao atualizar produto', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    const ranking = await this.prisma.rankingClientes.delete({
      where: {
        id
      }
    })

    if (!ranking) {
      throw new Warning('Não foi possível excluir o produto', 400)
    }

    return ['Raking excluído com sucesso']
  }
}

export { RankingClientesRepository }

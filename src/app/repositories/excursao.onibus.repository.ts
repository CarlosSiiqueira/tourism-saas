import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IExcursaoOnibus, IExcursaoOnibusDTO, IExcursaoOnibusResponse } from "../interfaces/ExcursaoOnibus"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class ExcursaoOnibusRepository implements IExcursaoOnibus {

  private prisma = prismaManager.getPrisma()

  index = async (idExcursao: string, { orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IExcursaoOnibusResponse[] }> => {
    const where = {
      codigoExcursao: idExcursao
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          Object.assign(where, {
            OR: [
              {
                Pessoas: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.excursaoOnibus.count({ where }),
      this.prisma.excursaoOnibus.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Pessoa: true
        }

      })
    ])

    return { count, rows }
  }

  create = async ({
    numeroCadeira,
    codigoExcursao,
    codigoPassageiro,
    usuarioCadastro
  }: IExcursaoOnibusDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const excursaoOnibus = await this.prisma.excursaoOnibus.create({
        data: {
          id: id,
          numeroCadeira: numeroCadeira,
          codigoExcursao: codigoExcursao,
          usuarioCadastro: usuarioCadastro,
          codigoPassageiro: codigoPassageiro
        }
      })

      if (!excursaoOnibus) {
        throw new Warning('excursao sem Onibus configurados', 400)
      }

      return ['Cadeira do onibus definidos com sucesso']

    } catch (error) {
      return ['Erro ao definir cadeira']
    }
  }

  find = async (idExcursao: string, idCadeira: string): Promise<IExcursaoOnibusResponse> => {

    const excursaoOnibus = await this.prisma.excursaoOnibus.findFirst({
      where: {
        codigoExcursao: idExcursao,
        id: idCadeira
      },
      include: {
        Pessoa: true,
        Excursao: true
      }
    })

    if (!excursaoOnibus) {
      throw new Warning('Não existem cadeiras Onibus definidos para essa excursao', 400)
    }

    return excursaoOnibus
  }

  findAll = async (idExcursao: string): Promise<IExcursaoOnibusResponse[]> => {

    const excursaoOnibus = await this.prisma.excursaoOnibus.findMany({
      where: {
        codigoExcursao: idExcursao
      },
      include: {
        Pessoa: true,
        Excursao: true
      }
    })

    if (!excursaoOnibus) {
      throw new Warning('Não existem cadeiras Onibus definidos para essa excursao', 400)
    }

    return excursaoOnibus
  }

  update = async ({
    numeroCadeira,
    codigoPassageiro,
    usuarioCadastro }: IExcursaoOnibusDTO, id: string): Promise<string[]> => {

    const excursaoOnibus = await this.prisma.excursaoOnibus.update({
      data: {
        numeroCadeira: numeroCadeira,
        dataCadastro: new Date(),
        codigoPassageiro: codigoPassageiro,
        usuarioCadastro: usuarioCadastro
      },
      where: {
        id: id
      }
    })

    if (!excursaoOnibus) {
      throw new Warning('registro não encontrado', 400)
    }

    return ['Registro atualizado com sucesso']
  }
}

export { ExcursaoOnibusRepository }

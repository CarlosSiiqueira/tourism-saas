import prismaManager from "../database/database";
import { IPassageiroEmbarque, IPassageiroEmbarqueDTO, IPassageiroEmbarqueIndexResponse, IPassageiroEmbarqueResponse } from "../interfaces/PassageiroEmbarque";
import { IIndex } from "../interfaces/Helper";
import { Warning } from "../errors";

class PassageiroEmbarqueRepository implements IPassageiroEmbarque {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number; rows: IPassageiroEmbarqueIndexResponse[]; }> => {
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
                Passageiro: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                LocalEmbarque: {
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
      this.prisma.passageiroEmbarque.count({ where }),
      this.prisma.passageiroEmbarque.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          LocalEmbarque: true,
          Passageiro: true
        }
      })

    ])

    return { rows, count }
  }

  create = async ({
    embarcou,
    horaEmbarque,
    codigoLocalEmbarque,
    codigoExcursao,
    codigoPassageiro,
    usuarioCadastro }: IPassageiroEmbarqueDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const passageiroEmbarque = await this.prisma.passageiroEmbarque.create({
        data: {
          id,
          embarcou,
          horaEmbarque,
          codigoLocalEmbarque,
          codigoExcursao,
          codigoPassageiro,
          usuarioCadastro
        }
      })

      return ['Embarque registrado com sucesso']
    } catch (error) {
      throw new Warning('Erro ao inserir embarque', 400)
    }
  }

  find = async (id: string): Promise<IPassageiroEmbarqueResponse> => {

    const passageiroEmbarque = await this.prisma.passageiroEmbarque.findFirst({
      where: {
        id
      }
    })

    if (!passageiroEmbarque) {
      throw new Warning('Embarque não encontrado', 400)
    }

    return passageiroEmbarque
  }

  findByExcursao = async (idExcursao: string): Promise<IPassageiroEmbarqueResponse[]> => {

    const passageiroEmbarque = await this.prisma.passageiroEmbarque.findMany({
      where: {
        codigoExcursao: idExcursao
      }
    })

    if (!passageiroEmbarque) {
      throw new Warning('Sem embarque registrados não encontrado', 400)
    }

    return passageiroEmbarque
  }

  findAll = async (): Promise<IPassageiroEmbarqueResponse[]> => {

    const passageiroEmbarque = await this.prisma.passageiroEmbarque.findMany()

    if (!passageiroEmbarque) {
      throw new Warning('Sem embarque registrados não encontrado', 400)
    }

    return passageiroEmbarque
  }

  embarqueDesembarque = async (data: IPassageiroEmbarqueResponse): Promise<string[]> => {

    const passageiroEmbarque = await this.prisma.passageiroEmbarque.update({
      data: {
        embarcou: data.embarcou,
        horaEmbarque: data.horaEmbarque
      },
      where: {
        id: data.id
      }
    })

    if (!passageiroEmbarque) {
      throw new Warning('Passageiro não encontrado', 400)
    }

    return data.embarcou ? ['Embarque registrado com sucesso'] : ['Desembarque registrado com sucesso']
  }

}

export { PassageiroEmbarqueRepository }

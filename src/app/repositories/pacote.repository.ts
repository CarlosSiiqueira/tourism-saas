import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IPacote, IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"
import { IIndex } from "../interfaces/Helper"

class PacoteRepository implements IPacote {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IPacoteResponse[] }> => {

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
            ]
          })
          break;

        case 'valor':
          Object.assign(where, {
            OR: [
              {
                valor: {
                  equals: parseFloat(value),
                }
              }
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.pacotes.count({ where }),
      this.prisma.pacotes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          LocalEmbarque: true,
          Destinos: true,

        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    valor,
    descricao,
    origem,
    codigoLocalEmbarque,
    codigoDestino,
    usuarioCadastro }: IPacoteDTO): Promise<{ 'message': string, 'status': number }> => {

    try {

      const id = crypto.randomUUID()

      const pacote = await this.prisma.pacotes.create({
        data: {
          id,
          nome,
          valor,
          descricao,
          origem,
          codigoLocalEmbarque,
          codigoDestino,
          usuarioCadastro
        }
      })

      return { 'message': 'Pacote criado com sucesso', 'status': 200 }

    } catch (error) {
      throw new Warning('Não foi possivel inserir o pacote', 400)
    }
  }

  find = async (id: string): Promise<IPacoteResponse> => {

    const pacote = await this.prisma.pacotes.findFirst({
      where: {
        id
      }
    })

    if (!pacote) {
      throw new Warning("Pacote não encontrado", 400)
    }

    return pacote
  }

  findAll = async (): Promise<IPacoteResponse[]> => {

    const pacotes = await this.prisma.pacotes.findMany({
      where: {
        ativo: true
      }
    })

    if (!pacotes) {
      throw new Warning("Sem pacotes encontrados na base", 400)
    }

    return pacotes
  }

  update = async ({
    nome,
    valor,
    descricao,
    ativo,
    origem,
    codigoLocalEmbarque,
    codigoDestino,
    usuarioCadastro }: IPacoteDTO, id: string): Promise<string[]> => {

    try {

      const pacote = await this.prisma.pacotes.update({
        data: {
          nome,
          valor,
          descricao,
          ativo,
          origem,
          codigoLocalEmbarque,
          codigoDestino,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return ['Pacote atualizado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar pacote', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    try {

      const pacote = await this.prisma.pacotes.update({
        data: {
          ativo: false
        },
        where: {
          id
        }
      })

      return ['Pacote excluido com sucesso']
    } catch (error) {
      throw new Warning('Ocorreu um erro ao excluir pacote', 400)
    }
  }

}

export { PacoteRepository }

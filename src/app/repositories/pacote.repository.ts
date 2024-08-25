import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IPacote, IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto'

class PacoteRepository implements IPacote {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IPacoteResponse[] }> => {

    const where = {
      ativo: true
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
          Excursao: true,
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    descricao,
    origem,
    tipoTransporte,
    urlImagem,
    urlImgEsgotado,
    destino,
    categoria,
    usuarioCadastro }: IPacoteDTO): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }> => {

    try {

      const id = crypto.randomUUID()

      const pacote = await this.prisma.pacotes.create({
        data: {
          id,
          nome,
          descricao,
          urlImagem,
          urlImgEsgotado,
          origem,
          tipoTransporte,
          destino,
          categoria,
          usuarioCadastro
        }
      })

      return { 'pacote': pacote, 'success': true }

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

    const pacotes = await this.prisma.pacotes.findMany()

    if (!pacotes) {
      throw new Warning("Sem pacotes encontrados na base", 400)
    }

    return pacotes
  }

  update = async ({
    nome,
    descricao,
    ativo,
    urlImagem,
    urlImgEsgotado,
    idWP,
    destino,
    categoria,
    origem,
    tipoTransporte,
    usuarioCadastro }: IPacoteDTO, id: string): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }> => {

    try {

      const pacote = await this.prisma.pacotes.update({
        data: {
          nome,
          descricao,
          ativo,
          urlImagem,
          urlImgEsgotado,
          idWP,
          destino,
          categoria,
          origem,
          tipoTransporte,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return { 'pacote': pacote, 'success': true }

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

  setIdWP = async (id: string, idWP: number): Promise<string[]> => {

    try {

      const pacote = await this.prisma.pacotes.update({
        data: {
          idWP: idWP
        },
        where: {
          id
        }
      })

      return ['Pacote atualizado com sucesso']
    } catch (error) {
      throw new Warning('Ocorreu um erro ao atualizar pacote', 400)
    }
  }

  getAllByIds = async (ids: Array<number>): Promise<IPacoteResponse[]> => {

    const pacotes = await this.prisma.pacotes.findMany({
      where: {
        idWP: {
          in: ids
        }
      }
    })

    if (!pacotes) {
      throw new Warning("Nenhum Pacote Encontrado", 400)
    }

    return pacotes
  }

}

export { PacoteRepository }

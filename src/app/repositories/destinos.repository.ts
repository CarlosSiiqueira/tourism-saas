import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IDestinos, IDestinosDTO, IDestinosResponse } from "../interfaces/Destinos";
import crypto from 'crypto';

class DestinosRepository implements IDestinos {

  private prisma = prismaManager.getPrisma()

  create = async (nome: string): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const destino = await this.prisma.destinos.create({
        data: {
          id,
          nome
        }
      })

      return ['Destino criado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao criar destino', 400)
    }

  }

  find = async (id: string): Promise<IDestinosResponse | null> => {

    const destino = await this.prisma.destinos.findUnique({
      where: {
        id
      }
    })

    if (!destino) {
      throw new Warning("Destino não encontrado", 400)
    }

    return destino

  }

  findAll = async (): Promise<IDestinosResponse[]> => {

    const destinos = await this.prisma.destinos.findMany({
      where: {
        ativo: true
      }
    })

    if (!destinos) {
      throw new Warning("Sem destinos cadastrados na base", 400)
    }

    return destinos

  }

  findByName = async (name: string): Promise<IDestinosDTO | null> => {

    const destino = await this.prisma.destinos.findFirst({
      where: {
        nome: {
          equals: name,
          mode: "insensitive"
        }
      }
    })

    return destino
  }

  update = async ({
    nome,
    ativo = true,
  }: IDestinosDTO, id: string): Promise<string[]> => {

    const destino = await this.prisma.destinos.update({
      data: {
        nome,
        ativo
      },
      where: {
        id
      }
    })

    if (!destino) {
      throw new Warning('Erro ao atualizar destino', 400)
    }

    return ['Destino atualizado com sucesso']

  }

  delete = async (id: string): Promise<string[]> => {

    const destino = await this.prisma.destinos.update({
      data: {
        ativo: false
      },
      where: {
        id
      }
    })

    if (!destino) {
      throw new Warning("Não foi possivel excluir Destino", 400)
    }

    return ['Destino excluído com sucesso']

  }

}

export { DestinosRepository }

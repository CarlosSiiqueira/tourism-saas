import prismaManager from "../database/database"
import { Warning } from "../errors"
import { ILog, ILogDTO, ILogResponse } from "../interfaces/Log"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class LogRepository implements ILog {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: ILogResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'tipo':
          Object.assign(where, {
            OR: [
              {
                tipo: {
                  contains: value,
                  mode: "insensitive"
                }
              }]
          })
          break;

        case 'usuario':
          Object.assign(where, {
            OR: [
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
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.logs.count({ where }),
      this.prisma.logs.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Usuario: true
        }
      })
    ])

    return { count, rows }

  }

  create = async ({
    tipo,
    newData,
    oldData,
    usuariosId }: ILogDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.logs.create({
        data: {
          id,
          tipo,
          newData: newData === null ? '' : newData,
          oldData: oldData === null ? '' : oldData,
          usuariosId
        }
      })

      return ['Log registrado com sucesso!']
    } catch (error) {
      throw new Warning('Erro ao criar log', 400)
    }
  }

  find = async (id: string): Promise<ILogResponse> => {

    const Log = await this.prisma.logs.findUnique({
      where: {
        id
      },
      include: {
        Usuario: true
      }
    })

    if (!Log) {
      throw new Warning("Log não encontrado", 400);
    }

    return Log
  }

  findAll = async (): Promise<ILogResponse[]> => {

    const contasBancarias = await this.prisma.logs.findMany({
      include: {
        Usuario: true
      }
    })

    if (!contasBancarias) {
      throw new Warning("Sem contas cadastradas na base", 400)
    }

    return contasBancarias
  }

  delete = async (id: string): Promise<string> => {

    const Log = await this.prisma.logs.delete({
      where: {
        id: id
      }
    })

    if (!Log) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id
  }

  update = async ({
    tipo,
    newData,
    oldData,
    usuariosId }: ILogDTO, id: string): Promise<string[]> => {

    const Log = await this.prisma.logs.update({
      data: {
        tipo,
        newData: newData === null ? '' : newData,
        oldData: oldData === null ? '' : oldData,
        usuariosId
      },
      where: {
        id: id
      }
    })

    if (!Log) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro Atualizado com sucesso'];
  }
}

export { LogRepository }

import prismaManager from "../database/database"
import { Warning } from "../errors"
import { ICreditoCliente, ICreditoClienteDTO, ICreditoClienteResponse } from "../interfaces/CreditoCliente"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class CreditoClienteRepository implements ICreditoCliente {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: ICreditoClienteResponse[] }> => {

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
                Cliente: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
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

        case 'valor':
          Object.assign(where, {
            OR: [
              {
                valor: parseInt(value)
              }
            ]
          })
          break;

        case 'idPessoa':
          Object.assign(where, {
            pessoasId: value
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.creditoClientes.count({ where }),
      this.prisma.creditoClientes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Cliente: true,
          Reserva: {
            include: {
              Excursao: true
            }
          },
          Usuario: true
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    valor,
    pessoasId,
    idReserva,
    usuariosId }: ICreditoClienteDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const credito = await this.prisma.creditoClientes.create({
        data: {
          id,
          valor,
          pessoasId,
          idReserva,
          usuariosId
        }
      })

      return id
    } catch (error) {
      throw new Warning('Houve um error ao gerar crédito', 400)
    }
  }

  find = async (id: string): Promise<ICreditoClienteResponse> => {

    const creditoCliente = await this.prisma.creditoClientes.findUnique({
      where: {
        id
      },
      include: {
        Cliente: true,
        Reserva: true,
        Usuario: true
      }
    })

    if (!creditoCliente) {
      throw new Warning("Crédito não encontrada", 400);
    }

    return creditoCliente
  }

  findAll = async (): Promise<ICreditoClienteResponse[]> => {

    const creditoClientes = await this.prisma.creditoClientes.findMany({
      where: {
        ativo: true
      },
      include: {
        Cliente: true,
        Reserva: true,
        Usuario: true
      }
    })

    if (!creditoClientes) {
      throw new Warning("Sem créditos cadastrados na base", 400)
    }

    return creditoClientes
  }

  findByCliente = async (idCliente: string): Promise<ICreditoClienteResponse[]> => {

    const credito = await this.prisma.creditoClientes.findMany({
      where: {
        pessoasId: idCliente
      }
    })

    if (!credito) {
      throw new Warning('Não foram encontrado créditos')
    }

    return credito
  }

  delete = async (id: string): Promise<ICreditoClienteResponse> => {

    const creditoCliente = await this.prisma.creditoClientes.update({
      where: {
        id: id
      },
      data: {
        ativo: false
      }
    })

    if (!creditoCliente) {
      throw new Warning('Registro não encontrado', 400)
    }

    return creditoCliente
  }

  update = async ({
    valor,
    pessoasId,
    idReserva,
    usuariosId }: ICreditoClienteDTO, id: string): Promise<ICreditoClienteResponse> => {

    const creditoCliente = await this.prisma.creditoClientes.update({
      data: {
        valor,
        pessoasId,
        idReserva,
        usuariosId
      },
      where: {
        id: id
      }
    })

    if (!creditoCliente) {
      throw new Warning('Registro não encontrado', 400)
    }

    return creditoCliente
  }

  setUtilizadoEm = async (id: string, data: Date, valor: number): Promise<string> => {

    const creditoCliente = await this.prisma.creditoClientes.update({
      data: {
        utilizadoEm: data,
        valor
      },
      where: {
        id: id
      }
    })

    if (!creditoCliente) {
      throw new Warning('Registro não encontrado', 400)
    }

    return 'Data registrada com sucesso'
  }
}

export { CreditoClienteRepository }

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
          Reserva: true,
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
    usuariosId }: ICreditoClienteDTO): Promise<string[]> => {

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

      return ['Crédito registrado com sucesso!']
    } catch (error) {
      throw new Warning('Houve um error ao gerar crédito', 400)
    }
  }

  find = async (id: string): Promise<ICreditoClienteResponse> => {

    const CreditoCliente = await this.prisma.creditoClientes.findUnique({
      where: {
        id
      },
      include: {
        Cliente: true,
        Reserva: true,
        Usuario: true
      }
    })

    if (!CreditoCliente) {
      throw new Warning("Crédito não encontrada", 400);
    }

    return CreditoCliente
  }

  findAll = async (): Promise<ICreditoClienteResponse[]> => {

    const contasBancarias = await this.prisma.creditoClientes.findMany({
      where: {
        ativo: true
      },
      include: {
        Cliente: true,
        Reserva: true,
        Usuario: true
      }
    })

    if (!contasBancarias) {
      throw new Warning("Sem créditos cadastrados na base", 400)
    }

    return contasBancarias
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

  delete = async (id: string): Promise<string> => {

    const CreditoCliente = await this.prisma.creditoClientes.update({
      where: {
        id: id
      },
      data: {
        ativo: false
      }
    })

    if (!CreditoCliente) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id
  }

  update = async ({
    valor,
    pessoasId,
    idReserva,
    usuariosId }: ICreditoClienteDTO, id: string): Promise<string[]> => {

    const CreditoCliente = await this.prisma.creditoClientes.update({
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

    if (!CreditoCliente) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro Atualizado com sucesso'];
  }
}

export { CreditoClienteRepository }

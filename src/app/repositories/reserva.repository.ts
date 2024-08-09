import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IReserva, IReservaDTO, IReservaResponse } from "../interfaces/Reserva"
import { IIndex } from "../interfaces/Helper"

class ReservaRepository implements IReserva {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IReservaResponse[] }> => {

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
      this.prisma.reservas.count({ where }),
      this.prisma.reservas.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        include: {
          Transacao: {
            include: {
              Pessoas: true,
              Fornecedor: true,
              Excursao: true,
              Pacotes: true,
              Usuarios: true,
              Produtos: true,
              FormaPagamento: true,
              ContaBancaria: true
            }
          }
        },
        where
      })
    ])

    return { count, rows }

  }

  create = async ({
    reserva,
    codigoUsuario,
    codigoFinanceiro }: IReservaDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.reservas.create({
        data: {
          id,
          reserva,
          codigoUsuario,
          codigoFinanceiro
        }
      })

      return id
    } catch (error) {
      throw new Warning("Erro ao inserir reserva", 400)
    }
  }

  find = async (id: string): Promise<IReservaResponse> => {

    const Reserva = await this.prisma.reservas.findUnique({
      where: {
        id
      },
      include: {
        Transacao: {
          include: {
            Pessoas: true,
            Fornecedor: true,
            Excursao: true,
            Pacotes: true,
            Usuarios: true,
            Produtos: true,
            FormaPagamento: true,
            ContaBancaria: true
          }
        }
      },
    })

    if (!Reserva) {
      throw new Warning("Reserva não encontrada", 400);
    }

    return Reserva
  }

  findAll = async (): Promise<IReservaResponse[]> => {

    const contasBancarias = await this.prisma.reservas.findMany({
      include: {
        Transacao: {
          include: {
            Pessoas: true,
            Fornecedor: true,
            Excursao: true,
            Pacotes: true,
            Usuarios: true,
            Produtos: true,
            FormaPagamento: true,
            ContaBancaria: true
          }
        }
      },
    })

    if (!contasBancarias) {
      throw new Warning("Sem reservas cadastradas na base", 400)
    }

    return contasBancarias
  }

  delete = async (id: string): Promise<string> => {

    const Reserva = await this.prisma.reservas.delete({
      where: {
        id: id
      }
    })

    if (!Reserva) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id
  }

  update = async ({
    reserva,
    codigoUsuario,
    codigoFinanceiro
  }: IReservaDTO, id: string): Promise<string[]> => {

    const Reserva = await this.prisma.reservas.update({
      data: {
        reserva,
        codigoUsuario,
        codigoFinanceiro
      },
      where: {
        id: id
      }
    })

    if (!Reserva) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Reserva Atualizada com sucesso'];
  }
}

export { ReservaRepository }

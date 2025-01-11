import { IFormaPagamentoDTO, IFormaPagamento, IFormaPagamentoResponse, IFormaPagamentoFilter } from "../interfaces/FormaPagamento"
import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto'

class FormaPagamentoRepository implements IFormaPagamento {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IFormaPagamentoResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    let filterOR: IFormaPagamentoFilter[] = []

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          filterOR.push(
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
          )
          break;

        case 'status':
          if (value !== 'all') {
            Object.assign(where, {
              ativo: parseInt(value) == 1 ? true : false
            })
          }
          break;

        case 'taxa':
          filterOR.push(
            {
              taxa: {
                equals: parseInt(value)
              }
            }
          )
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.formaPagamento.count({ where }),
      this.prisma.formaPagamento.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where
      })
    ])

    return { count, rows }

  }

  create = async ({
    nome,
    taxa,
    taxa1x,
    taxa2x,
    taxa3x,
    taxa4x,
    taxa5x,
    taxa6x,
    taxa7x,
    taxa8x,
    taxa9x,
    taxa10x,
    taxa11x,
    taxa12x,
    qtdDiasRecebimento,
    usuarioCadastro,
    creditCard
  }: IFormaPagamentoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const formaPagamento = await this.prisma.formaPagamento.create({
        data: {
          id,
          nome,
          taxa,
          taxa1x,
          taxa2x,
          taxa3x,
          taxa4x,
          taxa5x,
          taxa6x,
          taxa7x,
          taxa8x,
          taxa9x,
          taxa10x,
          taxa11x,
          taxa12x,
          qtdDiasRecebimento,
          usuarioCadastro,
          creditCard
        }
      })

      return ['Registro inserido com sucesso']

    } catch (error) {
      return ['erro ao inserir registro']
    }
  }

  find = async (id: string): Promise<IFormaPagamentoResponse> => {

    const formaPagamento = await this.prisma.formaPagamento.findUnique({
      where: {
        id
      }
    })

    if (!formaPagamento) {
      throw new Warning("Forma de pagamento não encontrada", 400)
    }

    return formaPagamento

  }

  findByName = async (nome: string): Promise<IFormaPagamentoResponse> => {

    const formaPagamento = await this.prisma.formaPagamento.findFirst({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive"
        }
      }
    })

    if (!formaPagamento) {
      throw new Warning("Forma de pagamento não encontrada", 400)
    }

    return formaPagamento
  }

  findAll = async (): Promise<IFormaPagamentoResponse[]> => {

    const formaPagamento = await this.prisma.formaPagamento.findMany({
      where: {
        ativo: true
      }
    })

    if (!formaPagamento) {
      throw new Warning("Forma de pagamento não encontrada", 400)
    }

    return formaPagamento
  }

  update = async ({
    nome,
    taxa,
    taxa1x,
    taxa2x,
    taxa3x,
    taxa4x,
    taxa5x,
    taxa6x,
    taxa7x,
    taxa8x,
    taxa9x,
    taxa10x,
    taxa11x,
    taxa12x,
    qtdDiasRecebimento,
    usuarioCadastro,
    creditCard
  }: IFormaPagamentoDTO, id: string): Promise<string> => {

    const formaPagamento = await this.prisma.formaPagamento.update({
      data: {
        nome,
        dataCadastro: new Date(),
        taxa,
        taxa1x,
        taxa2x,
        taxa3x,
        taxa4x,
        taxa5x,
        taxa6x,
        taxa7x,
        taxa8x,
        taxa9x,
        taxa10x,
        taxa11x,
        taxa12x,
        qtdDiasRecebimento,
        usuarioCadastro,
        creditCard
      },
      where: {
        id: id
      }
    })

    if (!formaPagamento) {
      throw new Warning('Registro não encontrado, falha na atualização', 400)
    }

    return id
  }

  delete = async (id: string): Promise<IFormaPagamentoResponse> => {

    const formaPagamento = await this.prisma.formaPagamento.delete({
      where: {
        id: id
      }
    })

    if (!formaPagamento) {
      throw new Warning('Não foi possivel excluir registro, registro não encontrado', 400)
    }

    return formaPagamento
  }
}

export { FormaPagamentoRepository }

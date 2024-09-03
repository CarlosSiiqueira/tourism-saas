import { IExcursao, IExcursaoDTO, IExcursaoResponse } from "../interfaces/Excursao"
import { IIndex } from "../interfaces/Helper"
import prismaManager from "../database/database"
import { dateValidate } from "../../shared/helper/date"
import { Warning } from "../errors"
import crypto from 'crypto'

interface where {
  ativo: boolean
  concluida?: boolean
}

class ExcursaoRepository implements IExcursao {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IExcursaoResponse[] }> => {

    const where: where = {
      ativo: true,
      concluida: false
    }

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          Object.assign(where, {
            OR: [
              {
                nome: {
                  contains: value,
                  mode: 'insensitive'
                }
              }
            ]
          })
          break;

        case 'concluida':
          if (value !== 'all') {
            where.concluida = parseInt(value) == 1 ? true : false
          }

          if (value == 'all') {
            delete where.concluida
          }
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.excursao.count({ where }),
      this.prisma.excursao.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        select: {
          id: true,
          nome: true,
          dataInicio: true,
          dataFim: true,
          observacoes: true,
          dataCadastro: true,
          ativo: true,
          gerouFinanceiro: true,
          vagas: true,
          codigoPacote: true,
          usuarioCadastro: true,
          valor: true,
          publicadoSite: true,
          concluida: true,
          ExcursaoPassageiros: {
            include: {
              Pessoa: true,
              LocalEmbarque: true
            }
          },
          Pacotes: {},
        }
      })
    ])

    for (const excursao of rows) {
      excursao.vagas -= excursao.ExcursaoPassageiros.length
    }

    return { count, rows }
  }

  create = async ({
    nome,
    dataInicio,
    dataFim,
    observacoes = '',
    ativo = true,
    gerouFinanceiro = false,
    vagas,
    valor,
    codigoPacote,
    usuarioCadastro,
  }: IExcursaoDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()
      dataInicio = dateValidate(dataInicio)
      dataFim = dateValidate(dataFim)

      const excursao = await this.prisma.excursao.create({
        data: {
          id: id,
          nome: nome,
          dataInicio: dataInicio,
          dataFim: dataFim,
          observacoes: observacoes,
          ativo: ativo,
          gerouFinanceiro: gerouFinanceiro,
          vagas: vagas,
          codigoPacote: codigoPacote,
          usuarioCadastro: usuarioCadastro,
          valor
        }
      })

      return id
    } catch (error) {
      throw new Warning('Erro ao criar excursao', 400)
    }
  }

  find = async (id: string): Promise<IExcursaoResponse> => {

    const excursao = await this.prisma.excursao.findFirst({
      where: {
        id
      },
      select: {
        id: true,
        nome: true,
        dataInicio: true,
        dataFim: true,
        observacoes: true,
        dataCadastro: true,
        ativo: true,
        gerouFinanceiro: true,
        vagas: true,
        codigoPacote: true,
        usuarioCadastro: true,
        valor: true,
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        },
        Pacotes: {
          include: {
            Produto: true
          }
        }
      }
    })

    if (!excursao) {
      throw new Warning('Excursão não encontrada', 400)
    }

    excursao.vagas -= excursao.ExcursaoPassageiros.length

    return excursao
  }

  findAll = async (): Promise<IExcursaoResponse[]> => {

    const excursoes = await this.prisma.excursao.findMany({
      where: {
        ativo: true
      }, select: {
        id: true,
        nome: true,
        dataInicio: true,
        dataFim: true,
        observacoes: true,
        dataCadastro: true,
        ativo: true,
        gerouFinanceiro: true,
        vagas: true,
        codigoPacote: true,
        usuarioCadastro: true,
        valor: true,
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        },
        Pacotes: {},
      }
    })

    if (!excursoes) {
      throw new Warning("Sem excursões cadastradas na base", 400)
    }

    for (const excursao of excursoes) {
      excursao.vagas -= excursao.ExcursaoPassageiros.length
    }

    return excursoes
  }

  delete = async (id: string): Promise<string> => {

    const excursao = await this.prisma.excursao.update({
      data: {
        ativo: false
      },
      where: {
        id: id
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id

  }

  update = async ({
    nome,
    dataInicio,
    dataFim,
    observacoes = '',
    gerouFinanceiro = false,
    vagas,
    codigoPacote,
    usuarioCadastro,
    valor
  }: IExcursaoDTO, id: string): Promise<string[]> => {

    dataInicio = dateValidate(dataInicio)
    dataFim = dateValidate(dataFim)

    const excursao = await this.prisma.excursao.update({
      data: {
        nome: nome,
        dataInicio: dataInicio,
        dataFim: dataFim,
        observacoes: observacoes,
        dataCadastro: new Date(),
        gerouFinanceiro: gerouFinanceiro,
        vagas: vagas,
        codigoPacote: codigoPacote,
        usuarioCadastro: usuarioCadastro,
        valor: valor
      },
      where: {
        id: id
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro atualizado com sucesso']
  }

  publish = async (id: string): Promise<IExcursaoResponse> => {

    const excursao = await this.prisma.excursao.update({
      data: {
        publicadoSite: true
      },
      where: {
        id
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return excursao
  }

  concluir = async (id: string): Promise<IExcursaoResponse> => {

    const excursao = await this.prisma.excursao.update({
      where: {
        id
      },
      data: {
        concluida: true
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return excursao
  }
}

export { ExcursaoRepository }

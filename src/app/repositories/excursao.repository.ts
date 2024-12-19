import { IExcursao, IExcursaoDTO, IExcursaoFilter, IExcursaoResponse } from "../interfaces/Excursao"
import { IIndex } from "../interfaces/Helper"
import prismaManager from "../database/database"
import { dateValidate } from "../../shared/helper/date"
import { Warning } from "../errors"
import crypto from 'crypto'

class ExcursaoRepository implements IExcursao {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IExcursaoResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    let filterOR: IExcursaoFilter[] = []
    var dataIni: Date
    var dataFim: Date

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          filterOR.push(
            {
              nome: {
                contains: value,
                mode: 'insensitive'
              }
            },
            {
              Pacotes: {
                nome: {
                  contains: value,
                  mode: 'insensitive'
                }
              }
            }
          )
          break;

        case 'status':
          if (value !== 'all') {
            Object.assign(where, {
              concluida: parseInt(value) == 1 ? true : false
            })
          }
          break;

        case 'dataInicio':
          dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0)

          Object.assign(where,
            {
              dataInicio: {
                gte: dataIni
              }
            })
          break;

        case 'dataFim':
          dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23)
          dataFim.setMinutes(59)
          dataFim.setSeconds(59)

          Object.assign(where, {
            dataFim: {
              lte: dataFim
            }
          })
          break;

        case 'origem':
          Object.assign(where, {
            Pacotes: {
              origem: parseInt(value)
            }
          })
          break;

        case 'publicado':
          Object.assign(where, {
            publicadoSite: parseInt(value) == 1 ? true : false
          })
          break;

        case 'pacoteId':
          Object.assign(where, {
            Pacotes: {
              id: value
            }
          })

          break;
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

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
          qtdMinVendas: true,
          ExcursaoPassageiros: {
            include: {
              Pessoa: true,
              LocalEmbarque: true
            }
          },
          Pacotes: {
            include: {
              Imagem: true,
              ImagemBloqueado: true,
              Produto: true,
              Galeria: true
            }
          },
          LocalEmbarque: {}
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
    localEmbarque,
    qtdMinVendas
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
          valor,
          qtdMinVendas,
          LocalEmbarque: {
            connect: localEmbarque.map((localEmbarqueId) => ({ id: localEmbarqueId }))
          }
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
        qtdMinVendas: true,
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        },
        Pacotes: {
          include: {
            Produto: true,
            Galeria: true,
            Imagem: true,
            ImagemBloqueado: true
          }
        },
        LocalEmbarque: {}
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
        qtdMinVendas: true,
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        },
        Pacotes: {
          include: {
            Produto: true,
            Galeria: true,
            Imagem: true,
            ImagemBloqueado: true
          }
        },
        LocalEmbarque: {}
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
    valor,
    localEmbarque,
    qtdMinVendas
  }: IExcursaoDTO, id: string): Promise<IExcursaoResponse> => {

    dataInicio = dateValidate(dataInicio)
    dataFim = dateValidate(dataFim)

    await this.prisma.excursao.update({
      where: {
        id
      },
      data: {
        LocalEmbarque: {
          connect: []
        }
      }
    })

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
        valor: valor,
        qtdMinVendas,
        LocalEmbarque: {
          connect: localEmbarque.map((localEmbarqueId) => ({ id: localEmbarqueId }))
        }
      },
      where: {
        id: id
      },
      include: {
        LocalEmbarque: true
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return excursao
  }

  publish = async (id: string): Promise<IExcursaoResponse> => {

    const excursao = await this.prisma.excursao.update({
      data: {
        publicadoSite: true
      },
      where: {
        id
      },
      include: {
        LocalEmbarque: true
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
      },
      include: {
        LocalEmbarque: true
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return excursao
  }
}

export { ExcursaoRepository }

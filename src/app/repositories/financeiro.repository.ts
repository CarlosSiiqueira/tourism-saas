import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IFinanceiro, IFinanceiroDTO, IFinanceiroResponse } from "../interfaces/Financeiro";
import { IFinanceiroFilter, IIndex } from "../interfaces/Helper";
import crypto from 'crypto'

class FinanceiroRepository implements IFinanceiro {

  private prisma = prismaManager.getPrisma()

  index = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[] }> => {

    let filterOR: IFinanceiroFilter[] = []
    var filtered = false;
    let expiredDate = new Date()
    var dataIni: Date
    var dataFim: Date
    expiredDate.setDate(expiredDate.getDate())
    expiredDate.setHours(23)
    expiredDate.setMinutes(59)
    expiredDate.setSeconds(59)

    const where = {
      ativo: true,
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          if (value !== '') {
            filtered = true
            filterOR.push(
              {
                Pessoas: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                Fornecedor: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }

                }
              },
              {
                Excursao: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                Produtos: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                FormaPagamento: {
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
              },
              {
                observacao: {
                  contains: value,
                  mode: "insensitive"
                }
              },
              {
                ContaBancaria: {
                  nome: {
                    contains: value,
                    mode: 'insensitive'
                  }
                }
              }
            )
          }
          break;

        case 'valor':
          filtered = true
          filterOR.push({
            valor: parseFloat(value)
          })
          break;

        case 'dataInicio':
          filtered = true
          dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0)
          Object.assign(where, {
            data: {
              gte: dataIni
            }
          })
          break;

        case 'dataFim':
          filtered = true
          dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23)
          dataFim.setMinutes(59)
          dataFim.setSeconds(59)

          if (dataIni) {
            Object.assign(where, {
              data: {
                lte: dataFim,
                gte: dataIni
              }
            })

            break;
          }

          Object.assign(where, {
            data: {
              lte: dataFim,
              gte: dataFim
            }
          })
          break;

        case 'efetivado':
          if (value !== 'all') {
            filtered = true
            Object.assign(where, {
              efetivado: parseInt(value) == 1 ? true : false
            })
          }
          break;

        case 'codigoContaBancaria':
          Object.assign(where, {
            codigoContaBancaria: {
              in: value
            }
          })
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    if (!filtered) {
      Object.assign(where,
        {
          OR: [{
            data: {
              lte: expiredDate
            }
          }]
        }
      )
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Pessoas: true,
          Fornecedor: true,
          Excursao: {
            include: {
              Pacotes: true
            }
          },
          Pacotes: true,
          Usuarios: true,
          Produtos: true,
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: true
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    tipo,
    valor,
    vistoAdmin,
    data,
    efetivado,
    observacao,
    ativo,
    numeroComprovanteBancario,
    idWP,
    codigoPessoa,
    codigoFornecedor,
    codigoExcursao,
    codigoProduto,
    codigoPacote,
    codigoFormaPagamento,
    codigoContaBancaria,
    codigoCategoria,
    idReserva,
    usuarioCadastro
  }: IFinanceiroDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID();
      data = dateValidate(data)

      await this.prisma.transacoes.create({
        data: {
          id,
          tipo,
          valor,
          vistoAdmin,
          data,
          efetivado,
          observacao,
          ativo,
          numeroComprovanteBancario,
          idWP,
          codigoPessoa,
          codigoFornecedor,
          codigoExcursao,
          codigoProduto,
          codigoPacote,
          codigoFormaPagamento,
          codigoContaBancaria,
          codigoCategoria,
          idReserva,
          usuarioCadastro
        }
      })

      return id

    } catch (error) {
      throw new Warning('Houve um erro ao gerar transação', 400)
    }

  }

  find = async (id: string): Promise<IFinanceiroResponse> => {

    const financeiro = await this.prisma.transacoes.findFirst({
      where: {
        id
      },
      include: {
        Pessoas: true,
        Fornecedor: true,
        Excursao: true,
        Produtos: true,
        Pacotes: true,
        FormaPagamento: true,
        Usuarios: true,
        ContaBancaria: true,
        CategoriaTransacao: {
          include: {
            SubCategoria: true
          }
        },
        Reservas: true
      }
    })

    if (!financeiro) {
      throw new Warning("Transação não encontrada", 400)
    }

    return financeiro
  }

  findAll = async (): Promise<IFinanceiroResponse[]> => {

    const financeiros = await this.prisma.transacoes.findMany({
      where: {
        ativo: true
      },
      include: {
        Pessoas: true,
        Fornecedor: true,
        Excursao: true,
        Produtos: true,
        Pacotes: true,
        FormaPagamento: true,
        Usuarios: true,
        ContaBancaria: true,
        CategoriaTransacao: {
          include: {
            SubCategoria: true
          }
        },
        Reservas: true
      }
    })

    if (!financeiros) {
      throw new Warning("Não foram encontrados registros na base", 400)
    }

    return financeiros
  }

  update = async ({
    tipo,
    valor,
    vistoAdmin,
    data,
    efetivado,
    observacao,
    ativo,
    numeroComprovanteBancario,
    idWP,
    codigoPessoa,
    codigoFornecedor,
    codigoExcursao,
    codigoProduto,
    codigoPacote,
    codigoFormaPagamento,
    codigoContaBancaria,
    codigoCategoria,
    idReserva,
    usuarioCadastro
  }: IFinanceiroDTO, id: string): Promise<string> => {

    try {

      data = dateValidate(data)

      const financeiro = await this.prisma.transacoes.update({
        data: {
          tipo,
          valor,
          vistoAdmin,
          data,
          efetivado,
          observacao,
          ativo,
          numeroComprovanteBancario,
          codigoPessoa,
          codigoFornecedor,
          codigoExcursao,
          codigoProduto,
          codigoPacote,
          codigoFormaPagamento,
          codigoContaBancaria,
          codigoCategoria,
          idReserva,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return id

    } catch (error) {
      throw new Warning('Houve um error ao atualizar transação', 400)
    }
  }

  delete = async (id: string): Promise<string> => {

    const financeiro = await this.prisma.transacoes.delete({
      where: {
        id
      }
    })

    if (!financeiro) {
      throw new Warning('Transação não encontrada', 400)
    }

    return id
  }

  setVistoAdmin = async (visto: boolean, id: string): Promise<string[]> => {

    const financeiro = await this.prisma.transacoes.update({
      data: {
        vistoAdmin: visto
      },
      where: {
        id: id
      }
    })

    if (!financeiro) {
      return ['Financeiro não encotrado']
    }

    return visto ? ['Financeiro liberado para efetivação'] : ['Financeiro bloqueado para efetivação']
  }

  checkVistoAdmin = async (id: string): Promise<boolean> => {

    const visto = await this.prisma.transacoes.findUnique({
      select: {
        vistoAdmin: true
      },
      where: {
        id
      }
    })

    if (!visto) {
      return false
    }

    return visto.vistoAdmin
  }

  efetivaDesfetiva = async (id: string, acao: boolean): Promise<string[]> => {

    const financeiro = await this.prisma.transacoes.update({
      data: {
        efetivado: acao
      },
      where: {
        id
      }
    })

    if (!financeiro) {
      return ['Não foi possível realizar operação']
    }

    return ['Financeiro liberado para alteração']
  }

  relatorioFinanceiroCliente = async ({ orderBy,
    order,
    skip,
    take,
    filter }: IIndex, idCliente: string): Promise<{ count: number, sum: number, rows: IFinanceiroResponse[] }> => {

    let filterOR = []
    filterOR.push({})

    const where = {
      ativo: true
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          if (value !== '') {
            filterOR.push(
              {
                Pessoas: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                Fornecedor: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }

                }
              },
              {
                Excursao: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                Produtos: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
                }
              },
              {
                FormaPagamento: {
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
              },
              {
                observacao: {
                  contains: value,
                  mode: "insensitive"
                }
              },
              {
                ContaBancaria: {
                  nome: {
                    contains: value,
                    mode: 'insensitive'
                  }
                }
              }
            )
          }
          break;

        case 'valor':
          filterOR.push({
            valor: parseFloat(value)
          })
          break;

        case 'dataInicio':
          let dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0)
          filterOR.push({
            data: {
              gte: dataIni
            }
          })
          break;

        case 'dataFim':
          let dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23)
          dataFim.setMinutes(59)
          dataFim.setSeconds(59)
          filterOR.push({
            data: {
              lte: dataFim
            }
          })
          break;

        case 'efetivado':
          if (value !== 'all') {
            filterOR.push({
              efetivado: parseInt(value) == 1 ? true : false
            })
          }
          break;
      }
    })

    Object.assign(where, {
      OR: filterOR
    })

    const [sum, count, rows] = await this.prisma.$transaction([
      this.prisma.transacoes.aggregate({
        _sum: {
          valor: true
        },
        where: {
          Reservas: {
            excluida: false,
            Pessoa: {
              some: {
                id: idCliente
              }
            }
          },
          efetivado: true,
          AND: {
            NOT: [{
              codigoExcursao: null

            },
            {
              codigoPacote: null
            }]
          }
        }
      }),
      this.prisma.transacoes.count({
        where: {
          Reservas: {
            excluida: false,
            Pessoa: {
              some: {
                id: idCliente
              }
            }
          },
          efetivado: true,
          AND: {
            NOT: [{
              codigoExcursao: null

            },
            {
              codigoPacote: null
            }]
          }
        }
      }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where: {
          Reservas: {
            excluida: false,
            Pessoa: {
              some: {
                id: idCliente
              }
            }
          },
          efetivado: true,
          AND: {
            NOT: [{
              codigoExcursao: null

            },
            {
              codigoPacote: null
            }]
          }
        },
        include: {
          Pessoas: true,
          Fornecedor: true,
          Excursao: true,
          Pacotes: true,
          Usuarios: true,
          Produtos: true,
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: true
        }
      })
    ])

    return { sum: sum._sum.valor || 0, count, rows }
  }

  relatorioFinanceiroCategoria = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex
  ): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }> => {

    const where = {
      ativo: true,
      data: {},
      AND: {
        NOT: [{
          codigoCategoria: null
        },
        {
          codigoContaBancaria: null
        }]
      }
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'codigoCategoria':
          Object.assign(where, {
            codigoCategoria: value
          })
          break;

        case 'codigoSubCategoria':
          Object.assign(where, {
            CategoriaTransacao: {
              codigoSubCategoria: value
            }
          })
          break;

        case 'dataInicio':
          const dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0, 0, 0, 0)
          Object.assign(where.data, {
            gte: dataIni,
          })
          break;

        case 'dataFim':
          const dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23, 59, 59, 999)
          Object.assign(where.data, {
            lte: dataFim
          })
          break;

        default:
          Object.assign(where, {
            [key]: {
              contains: value,
              mode: "insensitive"
            }
          })
          break;
      }
    })

    const [count, rows, somaTipo1, somaTipo2] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Pessoas: true,
          Fornecedor: true,
          Excursao: {
            include: {
              Pacotes: true
            }
          },
          Usuarios: true,
          Produtos: true,
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: true
        }
      }),
      this.prisma.transacoes.aggregate({
        _sum: {
          valor: true
        },
        where: {
          ...where,
          tipo: 1
        }
      }),
      this.prisma.transacoes.aggregate({
        _sum: {
          valor: true
        },
        where: {
          ...where,
          tipo: 2
        }
      })
    ]);

    return {
      count,
      rows,
      despesas: somaTipo1._sum.valor || 0,
      receitas: somaTipo2._sum.valor || 0
    };

  }

  relatorioFinanceiroExcursoes = async ({
    orderBy,
    order,
    skip,
    take,
    filter
  }: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }> => {

    const where = {
      ativo: true,
      data: {},
      AND: {
        NOT: [{
          codigoExcursao: null,
        },
        {
          codigoContaBancaria: null
        }]
      }
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'codigoExcursao':
          Object.assign(where, {
            codigoExcursao: value
          })
          break;

        case 'dataInicio':
          const dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0, 0, 0, 0)
          Object.assign(where.data, {
            gte: dataIni,
          })
          break;

        case 'dataFim':
          const dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23, 59, 59, 999)
          Object.assign(where.data, {
            lte: dataFim
          })
          break;

        default:
          Object.assign(where, {
            [key]: {
              contains: value,
              mode: "insensitive"
            }
          })
          break;
      }
    })

    const [count, rows, summaryDebit, summaryCredit] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: true,
          Usuarios: true,
          Excursao: {
            include: {
              Pacotes: true
            }
          }
        }
      }),
      this.prisma.transacoes.aggregate({
        where: {
          ...where,
          tipo: 1
        },
        _sum: {
          valor: true
        }
      }),
      this.prisma.transacoes.aggregate({
        where: {
          ...where,
          tipo: 2
        },
        _sum: {
          valor: true
        }
      })
    ])

    return {
      count,
      rows,
      despesas: summaryDebit._sum.valor || 0,
      receitas: summaryCredit._sum.valor || 0
    }
  }

  relatorioFinanceiroFornecedor = async ({
    orderBy,
    order,
    skip,
    take,
    filter
  }: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], despesas: number }> => {

    const where = {
      ativo: true,
      data: {},
      AND: {
        tipo: 1,
        NOT: [{
          codigoFornecedor: null
        },
        {
          codigoContaBancaria: null
        }]
      }
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'codigoFornecedor':
          Object.assign(where, {
            codigoFornecedor: value
          })
          break;

        case 'dataInicio':
          const dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0, 0, 0, 0)
          Object.assign(where.data, {
            gte: dataIni,
          })
          break;

        case 'dataFim':
          const dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23, 59, 59, 999)
          Object.assign(where.data, {
            lte: dataFim
          })
          break;

        default:
          Object.assign(where, {
            [key]: {
              contains: value,
              mode: "insensitive"
            }
          })
          break;
      }
    })

    const [count, rows, summaryDebit] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: true,
          Usuarios: true,
          Fornecedor: true
        }
      }),
      this.prisma.transacoes.aggregate({
        where,
        _sum: {
          valor: true
        }
      })
    ])

    return {
      count,
      rows,
      despesas: summaryDebit._sum.valor || 0
    }
  }

  relatorioFinanceiroPacote = async ({
    orderBy,
    order,
    skip,
    take,
    filter
  }: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], receitas: number, despesas: number }> => {

    const where = {
      ativo: true,
      data: {},
      AND: {
        NOT: [{
          codigoPacote: null
        },
        {
          codigoContaBancaria: null
        }]
      }
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'codigoPacote':
          Object.assign(where, {
            codigoPacote: value
          })
          break;

        case 'dataInicio':
          const dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0, 0, 0, 0)
          Object.assign(where.data, {
            gte: dataIni,
          })
          break;

        case 'dataFim':
          const dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23, 59, 59, 999)
          Object.assign(where.data, {
            lte: dataFim
          })
          break;

        default:
          Object.assign(where, {
            [key]: {
              contains: value,
              mode: "insensitive"
            }
          })
          break;
      }
    })

    const [count, rows, summaryDebit, summaryCredit] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: true,
          Usuarios: true,
          Fornecedor: true,
          Pacotes: true
        }
      }),
      this.prisma.transacoes.aggregate({
        where: {
          ...where,
          tipo: 1
        },
        _sum: {
          valor: true
        }
      }),
      this.prisma.transacoes.aggregate({
        where: {
          ...where,
          tipo: 2
        },
        _sum: {
          valor: true
        }
      })
    ])

    return {
      count,
      rows,
      despesas: summaryDebit._sum.valor || 0,
      receitas: summaryCredit._sum.valor || 0
    }
  }

  relatorioFinanceiroVenda = async ({
    orderBy,
    order,
    skip,
    take,
    filter
  }: IIndex): Promise<{ count: number, rows: IFinanceiroResponse[], vendas: number }> => {

    const where = {
      ativo: true,
      efetivado: true,
      tipo: 2,
      data: {},
      AND: {
        NOT: [{
          idReserva: null
        },
        {
          codigoContaBancaria: null
        }]
      }
    }

    Object.entries(filter as {
      [key: string]: string
    }).map(([key, value]) => {

      switch (key) {
        case 'codigoUsuario':
          Object.assign(where, {
            Reservas: {
              codigoUsuario: {
                equals: value
              }
            }
          })
          break;

        case 'dataInicio':
          const dataIni = dateValidate(value)
          dataIni.setDate(dataIni.getDate() + 1)
          dataIni.setHours(0, 0, 0, 0)
          Object.assign(where.data, {
            gte: dataIni,
          })
          break;

        case 'dataFim':
          const dataFim = dateValidate(value)
          dataFim.setDate(dataFim.getDate() + 1)
          dataFim.setHours(23, 59, 59, 999)
          Object.assign(where.data, {
            lte: dataFim
          })
          break;

        default:
          Object.assign(where, {
            [key]: {
              contains: value,
              mode: "insensitive"
            }
          })
          break;
      }
    })

    const [count, rows, summaryVendas] = await this.prisma.$transaction([
      this.prisma.transacoes.count({ where }),
      this.prisma.transacoes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          FormaPagamento: true,
          ContaBancaria: true,
          CategoriaTransacao: {
            include: {
              SubCategoria: true
            }
          },
          Reservas: {
            include: {
              Usuario: true
            }
          },
          Excursao: true,
          Usuarios: true,
          Fornecedor: true,
        }
      }),
      this.prisma.transacoes.aggregate({
        where,
        _sum: {
          valor: true
        }
      })
    ])

    return {
      count,
      rows,
      vendas: summaryVendas._sum.valor || 0
    }
  }
}

export { FinanceiroRepository }

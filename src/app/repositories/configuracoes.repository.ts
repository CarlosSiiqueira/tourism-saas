import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IConfiguracao, IConfiguracaoDTO, IConfiguracaoFilter, IConfiguracaoResponse } from "../interfaces/Configuracoes"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto';

class ConfiguracoesRepository implements IConfiguracao {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IConfiguracaoResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    let filterOR: IConfiguracaoFilter[] = []

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

        case 'saldo':
          if (value) {
            filterOR.push(
              {
                saldo: {
                  equals: parseInt(value)
                }
              }
            )
          }
          break;

        case 'status':
          if (value !== 'all') {
            Object.assign(where, {
              ativo: parseInt(value) == 1 ? true : false
            })
          }
          break;
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.configuracoes.count({ where }),
      this.prisma.configuracoes.findMany({
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
    configuracao,
    dataCadastro,
    idUsuario,
  }: IConfiguracaoDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.configuracoes.create({
        data: {
          id,
          tipo,
          configuracao: configuracao == null ? '' : configuracao,
          dataCadastro,
          idUsuario,
        }
      })

      return id

    } catch (error) {
      throw new Warning('Erro ao criar configuração', 400)
    }
  }

  find = async (id: string): Promise<IConfiguracaoResponse> => {

    const configuracao = await this.prisma.configuracoes.findUnique({
      where: {
        id
      },
      include: {
        Usuario: true
      }
    })

    if (!configuracao) {
      throw new Warning("Configuração não encontrada", 400);
    }

    return configuracao
  }

  findAll = async (): Promise<IConfiguracaoResponse[]> => {

    const configuraçoes = await this.prisma.configuracoes.findMany({
      include: {
        Usuario: true
      }
    })

    if (!configuraçoes) {
      throw new Warning("Sem configurações cadastradas na base", 400)
    }

    return configuraçoes
  }

  delete = async (id: string): Promise<IConfiguracaoResponse> => {

    const configuracao = await this.prisma.configuracoes.delete({
      where: {
        id: id
      }
    })

    if (!configuracao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return configuracao
  }

  update = async ({
    tipo,
    configuracao,
    dataCadastro,
    idUsuario
  }: IConfiguracaoDTO, id: string): Promise<IConfiguracaoResponse> => {

    const config = await this.prisma.configuracoes.update({
      data: {
        tipo,
        configuracao: configuracao === null ? '' : configuracao,
        dataCadastro,
        idUsuario,
      },
      where: {
        id: id
      },
      include: {
        Usuario: true
      }
    })

    if (!config) {
      throw new Warning('Registro não encontrado', 400)
    }

    return config
  }

  findByType = async (tipo: string): Promise<IConfiguracaoResponse> => {

    const config = await this.prisma.configuracoes.findFirst({
      where: {
        tipo
      }
    })

    if (!config) {
      throw new Warning("Registro não encontrado", 400)
    }

    return config
  }
}

export { ConfiguracoesRepository }

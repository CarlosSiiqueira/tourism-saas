import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IPacote, IPacoteDTO, IPacoteFilter, IPacoteResponse } from "../interfaces/Pacote"
import { IIndex } from "../interfaces/Helper"
import crypto from 'crypto'

class PacoteRepository implements IPacote {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IPacoteResponse[] }> => {

    const where = {
      NOT: {
        id: undefined
      }
    }

    let filterOR: IPacoteFilter[] = []

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
              Produto: {
                some: {
                  nome: {
                    contains: value,
                    mode: "insensitive"
                  }
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
          break

        case 'origem':
          if (value !== 'all') {
            Object.assign(where, {
              origem: parseInt(value)
            })
          }
          break
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.pacotes.count({ where }),
      this.prisma.pacotes.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
        include: {
          Excursao: true,
          Produto: true,
          Imagem: true,
          ImagemBloqueado: true,
          Galeria: true,
          Inclusos: true
        }
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    descricao,
    origem,
    tipoTransporte,
    urlImagem,
    urlImgEsgotado,
    categoria,
    usuarioCadastro,
    opcionais,
    galeria,
    inclusos }: IPacoteDTO): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }> => {

    try {

      const id = crypto.randomUUID()

      const opcional = {}
      const galeriaFotos = {}
      const itemsInclusos = {}

      if (opcionais) {
        Object.assign(opcional,
          {
            Produto: {
              connect: opcionais.map((opt) => { return { id: opt } })
            }
          }
        )
      }

      if (galeria) {
        Object.assign(galeriaFotos,
          {
            Galeria: {
              connect: galeria.map((img) => { return { id: img } })
            }
          }
        )
      }

      if (inclusos) {
        Object.assign(itemsInclusos,
          {
            Inclusos: {
              connect: inclusos.map((item) => { return { id: item } })
            }
          }
        )
      }

      const pacote = await this.prisma.pacotes.create({
        data: {
          id,
          nome,
          descricao,
          urlImagem,
          urlImgEsgotado,
          origem,
          tipoTransporte,
          categoria,
          usuarioCadastro,
          ...opcional,
          ...galeriaFotos,
          ...itemsInclusos
        }
      })

      return { 'pacote': pacote, 'success': true }

    } catch (error) {
      throw new Warning('Não foi possivel inserir o pacote', 400)
    }
  }

  find = async (id: string): Promise<IPacoteResponse> => {

    const pacote = await this.prisma.pacotes.findFirst({
      where: {
        id
      },
      include: {
        Produto: true,
        Imagem: true,
        ImagemBloqueado: true,
        Inclusos: true
      }
    })

    if (!pacote) {
      throw new Warning("Pacote não encontrado", 400)
    }

    return pacote
  }

  findAll = async (): Promise<IPacoteResponse[]> => {

    const pacotes = await this.prisma.pacotes.findMany({
      include: {
        Produto: true,
        Imagem: true,
        ImagemBloqueado: true,
        Inclusos: true
      }
    })

    if (!pacotes) {
      throw new Warning("Sem pacotes encontrados na base", 400)
    }

    return pacotes
  }

  update = async ({
    nome,
    descricao,
    ativo,
    urlImagem,
    urlImgEsgotado,
    idWP,
    categoria,
    origem,
    tipoTransporte,
    usuarioCadastro,
    opcionais,
    galeria,
    inclusos }: IPacoteDTO, id: string): Promise<{ 'pacote': IPacoteResponse, 'success': boolean }> => {

    try {

      const opcional = {}
      const galeriaFotos = {}
      const itemsInclusos = {}

      await this.prisma.pacotes.update({
        where: {
          id
        },
        data: {
          Produto: {
            set: []
          },
          Galeria: {
            set: []
          }
        }
      })

      if (opcionais) {
        Object.assign(opcional,
          {
            Produto: {
              connect: opcionais.map((opt) => { return { id: opt } })
            }
          }
        )
      }

      if (galeria) {
        Object.assign(galeriaFotos,
          {
            Galeria: {
              connect: galeria.map((img) => { return { id: img } })
            }
          }
        )
      }

      if (inclusos) {
        Object.assign(itemsInclusos,
          {
            Inclusos: {
              connect: inclusos.map((item) => { return { id: item } })
            }
          }
        )
      }

      const pacote = await this.prisma.pacotes.update({
        data: {
          nome,
          descricao,
          ativo,
          urlImagem,
          urlImgEsgotado,
          idWP,
          categoria,
          origem,
          tipoTransporte,
          usuarioCadastro,
          ...opcional,
          ...galeriaFotos,
          ...itemsInclusos
        },
        where: {
          id
        }
      })

      return { 'pacote': pacote, 'success': true }

    } catch (error) {
      throw new Warning('Erro ao atualizar pacote', 400)
    }
  }

  delete = async (id: string): Promise<IPacoteResponse> => {

    try {

      const pacote = await this.prisma.pacotes.update({
        data: {
          ativo: false
        },
        where: {
          id
        }
      })

      return pacote
    } catch (error) {
      throw new Warning('Ocorreu um erro ao excluir pacote', 400)
    }
  }

  setIdWP = async (id: string, idWP: number): Promise<string[]> => {

    try {

      const pacote = await this.prisma.pacotes.update({
        data: {
          idWP: idWP
        },
        where: {
          id
        }
      })

      return ['Pacote atualizado com sucesso']
    } catch (error) {
      throw new Warning('Ocorreu um erro ao atualizar pacote', 400)
    }
  }

  getAllByIds = async (ids: Array<number>): Promise<IPacoteResponse[]> => {

    const pacotes = await this.prisma.pacotes.findMany({
      where: {
        idWP: {
          in: ids
        }
      }
    })

    if (!pacotes) {
      throw new Warning("Nenhum Pacote Encontrado", 400)
    }

    return pacotes
  }

}

export { PacoteRepository }

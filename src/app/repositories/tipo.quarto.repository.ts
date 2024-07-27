import prismaManager from "../database/database";
import { Warning } from "../errors";
import { IIndex } from "../interfaces/Helper";
import { ITipoQuarto, ITipoQuartoDTO, ITipoQuartoResponse } from "../interfaces/TipoQuarto";

class TipoQuartoRepository implements ITipoQuarto {

  private prisma = prismaManager.getPrisma()

  index = async ({
    orderBy,
    order,
    skip,
    take,
    filter }: IIndex): Promise<{ count: number; rows: ITipoQuartoResponse[] }> => {

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
              }
            ]
          })
          break;
      }
    })

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.tipoQuarto.count({ where }),
      this.prisma.tipoQuarto.findMany({
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
    codigoUsuario
  }: ITipoQuartoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const venda = await this.prisma.tipoQuarto.create({
        data: {
          id,
          nome,
          codigoUsuario
        }
      })

      return ['Tipo quarto criado com sucesso']

    } catch (error) {
      throw new Warning('Não foi possível criar tipo quarto', 400)
    }

  }

  find = async (id: string): Promise<ITipoQuartoResponse | null> => {

    const venda = await this.prisma.tipoQuarto.findUnique({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Tipo Quarto não encontrada", 400)
    }

    return venda
  }

  findAll = async (): Promise<ITipoQuartoResponse[]> => {

    const TipoQuarto = await this.prisma.tipoQuarto.findMany()

    if (!TipoQuarto) {
      throw new Warning("Sem Tipo Quarto na base", 400)
    }

    return TipoQuarto
  }

  update = async ({
    nome,
    codigoUsuario
  }: ITipoQuartoDTO, id: string): Promise<string[]> => {

    try {

      let data = new Date(Date.now())

      const venda = await this.prisma.tipoQuarto.update({
        data: {
          nome,
          codigoUsuario
        },
        where: {
          id
        }
      })

      if (!venda) {
        throw new Warning("Tipo quarto não encontrado", 400)
      }

      return ['Tipo Quarto atualizado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar tipo quarto', 400)
    }

  }

  delete = async (id: string): Promise<string[]> => {

    const venda = await this.prisma.tipoQuarto.delete({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Tipo Quarto não encontrado", 400)
    }

    return ['Tipo Quarto excluído com sucesso']
  }

}

export { TipoQuartoRepository }

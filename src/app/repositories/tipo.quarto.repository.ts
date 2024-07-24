import prismaManager from "../database/database";
import { Warning } from "../errors";
import { ITipoQuarto, ITipoQuartoDTO, ITipoQuartoResponse } from "../interfaces/TipoQuarto";

class TipoQuartoRepository implements ITipoQuarto {

  private prisma = prismaManager.getPrisma()

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

      return ['Venda criada com sucesso']

    } catch (error) {
      throw new Warning('Não foi possível criar venda', 400)
    }

  }

  find = async (id: string): Promise<ITipoQuartoResponse | null> => {

    const venda = await this.prisma.tipoQuarto.findUnique({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Venda não encontrada", 400)
    }

    return venda
  }

  findAll = async (): Promise<ITipoQuartoResponse[]> => {

    const TipoQuarto = await this.prisma.tipoQuarto.findMany()

    if (!TipoQuarto) {
      throw new Warning("Sem TipoQuarto na base", 400)
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
        throw new Warning("Venda não encontrada", 400)
      }

      return ['Venda atualizada com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar venda', 400)
    }

  }

  delete = async (id: string): Promise<string[]> => {

    const venda = await this.prisma.tipoQuarto.delete({
      where: {
        id
      }
    })

    if (!venda) {
      throw new Warning("Venda não encontrada", 400)
    }

    return ['Venda excluída com sucesso']
  }

}

export { TipoQuartoRepository }

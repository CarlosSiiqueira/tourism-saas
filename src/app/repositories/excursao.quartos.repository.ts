import prismaManager from "../database/database"
import { IExcursaoQuartos, IExcursaoQuartosDTO, IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos"
import { Warning } from "../errors"

class ExcursaoQuartosRepository implements IExcursaoQuartos {

  private prisma = prismaManager.getPrisma()

  create = async ({
    numeroQuarto,
    codigoExcursao,
    codigoPassageiro,
    usuarioCadastro
  }: IExcursaoQuartosDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const excursaoQuartos = await this.prisma.excursaoQuartos.create({
        data: {
          id: id,
          numeroQuarto: numeroQuarto,          
          codigoExcursao: codigoExcursao,
          usuarioCadastro: usuarioCadastro,
          codigoPassageiro: codigoPassageiro
        }
      })

      if (!excursaoQuartos) {
        throw new Warning('excursao sem quartos configurados')
      }

      return ['Quartos definidos com sucesso']
      
    } catch (error) {
      return ['Erro ao registrar quarto']
    }
  }

  find = async (idExcursao: string): Promise<IExcursaoQuartosResponse[]> => {

    const excursaoQuartos = await this.prisma.excursaoQuartos.findMany({
      where: {
        codigoExcursao: idExcursao
      },
      include: {
        Passageiro: true,
        Excursao: true
      }
    })

    if (!excursaoQuartos) {
      throw new Warning('não existem quartos definidos para essa excursao', 400)
    }

    return excursaoQuartos
  }

  update = async ({
    numeroQuarto,
    codigoExcursao,
    codigoPassageiro,
    usuarioCadastro }: IExcursaoQuartosDTO, id: string): Promise<string[]> => {

    const excursaoQuartos = await this.prisma.excursaoQuartos.update({
      data: {
        numeroQuarto: numeroQuarto,
        dataCadastro: new Date(),
        // codigoExcursao: codigoExcursao,
        codigoPassageiro: codigoPassageiro,
        usuarioCadastro: usuarioCadastro
      },
      where: {
        id: id
      }
    })

    if (!excursaoQuartos) {
      throw new Warning('registro não encontrado', 400)
    }

    return ['Registro atualizado com sucesso']
  }
}

export { ExcursaoQuartosRepository }

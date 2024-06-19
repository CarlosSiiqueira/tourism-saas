import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IExcursaoOnibus, IExcursaoOnibusDTO, IExcursaoOnibusResponse } from "../interfaces/ExcursaoOnibus"

class ExcursaoOnibusRepository implements IExcursaoOnibus {

  private prisma = prismaManager.getPrisma()

  create = async ({
    numeroCadeira,
    codigoExcursao,
    codigoPassageiro,
    usuarioCadastro
  }: IExcursaoOnibusDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const excursaoOnibus = await this.prisma.excursaoOnibus.create({
        data: {
          id: id,
          numeroCadeira: numeroCadeira,          
          codigoExcursao: codigoExcursao,
          usuarioCadastro: usuarioCadastro,
          codigoPassageiro: codigoPassageiro
        }
      })

      if (!excursaoOnibus) {
        throw new Warning('excursao sem Onibus configurados', 400)
      }

      return ['Cadeira do onibus definidos com sucesso']
      
    } catch (error) {
      return ['Erro ao definir cadeira']
    }
  }

  find = async (idExcursao: string, idCadeira: string): Promise<IExcursaoOnibusResponse[]> => {

    const excursaoOnibus = await this.prisma.excursaoOnibus.findMany({
      where: {
        codigoExcursao: idExcursao,
        id: idCadeira
      },
      include: {
        Pessoa: true,
        Excursao: true
      }
    })

    if (!excursaoOnibus) {
      throw new Warning('não existem cadeiras Onibus definidos para essa excursao', 400)
    }

    return excursaoOnibus
  }

  update = async ({
    numeroCadeira,
    codigoPassageiro,
    usuarioCadastro }: IExcursaoOnibusDTO, id: string): Promise<string[]> => {

    const excursaoOnibus = await this.prisma.excursaoOnibus.update({
      data: {
        numeroCadeira: numeroCadeira,
        dataCadastro: new Date(),
        codigoPassageiro: codigoPassageiro,
        usuarioCadastro: usuarioCadastro
      },
      where: {
        id: id
      }
    })

    if (!excursaoOnibus) {
      throw new Warning('registro não encontrado', 400)
    }

    return ['Registro atualizado com sucesso']
  }
}

export { ExcursaoOnibusRepository }

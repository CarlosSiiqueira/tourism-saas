import prismaManager from "../database/database"
import { Warning } from "../errors"
import { ILocalEmbarque, ILocalEmbarqueDTO, ILocalEmbarqueResponse } from "../interfaces/LocalEmbarque"

class LocalEmbarqueRepository implements ILocalEmbarque {

  private prisma = prismaManager.getPrisma()

  create = async ({
    nome,
    observacoes,
    horaEmbarque,
    codigoEndereco,
    usuarioCadastro,
  }: ILocalEmbarqueDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const localEmbarque = await this.prisma.localEmbarque.create({
        data: {
          id,
          nome,
          observacoes: observacoes || '',
          horaEmbarque,
          codigoEndereco,
          usuarioCadastro
        }
      })

      return ['LocalEmbarque inserido com sucesso']

    } catch (error) {
      throw new Warning('Erro ao inserir LocalEmbarque', 400)
    }
  }

  find = async (id: string): Promise<ILocalEmbarqueResponse | null> => {

    const localEmbarque = await this.prisma.localEmbarque.findFirst({
      where: {
        id
      }
    })

    if (!localEmbarque) {
      throw new Warning("Local de embarque não encontrada", 400)
    }

    return localEmbarque

  }

  findAll = async (): Promise<ILocalEmbarqueResponse[]> => {

    const localEmbarques = await this.prisma.localEmbarque.findMany({
      where: {
        ativo: true
      }
    })

    if (!localEmbarques) {
      throw new Warning("Sem Local de embarques registradas na base", 400)
    }

    return localEmbarques
  }

  update = async ({
    nome,
    observacoes,
    horaEmbarque,
    codigoEndereco,
    usuarioCadastro }: ILocalEmbarqueDTO, id: string): Promise<string[]> => {

    try {

      const localEmbarque = await this.prisma.localEmbarque.update({
        data: {
          nome,
          observacoes: observacoes || '',
          horaEmbarque,
          dataCadastro: new Date(),
          codigoEndereco,
          usuarioCadastro
        },
        where: {
          id
        }
      })

      return ['Local de embarque atualizado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar LocalEmbarque', 400)
    }
  }

  delete = async (id: string): Promise<string[]> => {

    const localEmbarque = await this.prisma.localEmbarque.update({
      data: {
        ativo: false
      },
      where: {
        id
      }
    })

    if (!localEmbarque) {
      throw new Warning('Não foi possível excluir o Local de embarque', 400)
    }

    return ['Local de embarque excluido com sucesso']
  }
}

export { LocalEmbarqueRepository }

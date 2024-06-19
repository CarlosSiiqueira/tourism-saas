import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IContaBancaria, IContaBancariaDTO, IContaBancariaResponse } from "../interfaces/ContaBancaria"

class ContaBancariaRepository implements IContaBancaria {

  private prisma = prismaManager.getPrisma()

  create = async ({
    nome,
    saldo = 0,
    usuarioCadastro
  }: IContaBancariaDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      await this.prisma.contaBancaria.create({
        data: {
          id,
          nome,
          saldo,
          usuarioCadastro
        }
      })

      return ['Conta bancária cadastrada com sucesso!']

    } catch (error) {
      const a = error
      return ['not found']
    }
  }

  find = async (id: string): Promise<IContaBancariaResponse> => {

    const contaBancaria = await this.prisma.contaBancaria.findUnique({
      where: {
        id
      }
    })

    if (!contaBancaria) {
      throw new Warning("Conta não encontrada", 400);
    }

    return contaBancaria
  }

  findAll = async (): Promise<IContaBancariaResponse[]> => {

    const contasBancarias = await this.prisma.contaBancaria.findMany({
      where: {
        ativo: true
      }
    })

    if (!contasBancarias) {
      throw new Warning("Sem contas cadastradas na base", 400)
    }

    return contasBancarias
  }

  delete = async (id: string): Promise<string> => {

    const contaBancaria = await this.prisma.contaBancaria.update({
      data: {
        ativo: false
      },
      where: {
        id: id
      }
    })

    if (!contaBancaria) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id

  }

  update = async ({
    nome,
    saldo,
    usuarioCadastro
  }: IContaBancariaDTO, id: string): Promise<string[]> => {

    const contaBancaria = await this.prisma.contaBancaria.update({
      data: {
        nome: nome,
        saldo: saldo,
        dataCadastro: new Date(),
        usuarioCadastro: usuarioCadastro
      },
      where: {
        id: id
      }
    })

    if (!contaBancaria) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro Atualizado com sucesso'];
  }
}

export { ContaBancariaRepository }

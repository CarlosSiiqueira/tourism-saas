import { IFormaPagamentoDTO, IFormaPagamento, IFormaPagamentoResponse } from "../interfaces/FormaPagamento"
import prismaManager from "../database/database"
import { Warning } from "../errors"

class FormaPagamentoRepository implements IFormaPagamento {

  private prisma = prismaManager.getPrisma()

  create = async ({
    nome,
    taxa,
    qtdDiasRecebimento,
    codigoContaBancaria,
    usuarioCadastro
  }: IFormaPagamentoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const formaPagamento = await this.prisma.formaPagamento.create({
        data: {
          id,
          nome,
          taxa,
          qtdDiasRecebimento,
          codigoContaBancaria,
          usuarioCadastro
        }
      })

      return ['Registro inserido com sucesso']

    } catch (error) {
      return ['erro ao inserir registro']
    }
  }

  find = async (id: string): Promise<IFormaPagamentoResponse | null> => {

    const formaPagamento = await this.prisma.formaPagamento.findUnique({
      where: {
        id
      }
    })

    if (!formaPagamento) {
      throw new Warning("Forma de pagamento não encontrada", 400)
    }

    return formaPagamento

  }

  findAll = async (): Promise<IFormaPagamentoResponse[]> => {

    const formaPagamento = await this.prisma.formaPagamento.findMany({
      where: {
        ativo: true
      }
    })

    if (!formaPagamento) {
      throw new Warning("Forma de pagamento não encontrada", 400)
    }

    return formaPagamento
  }

  update = async ({
    nome,
    taxa,
    qtdDiasRecebimento,
    codigoContaBancaria,
    usuarioCadastro
  }: IFormaPagamentoDTO, id: string): Promise<string[]> => {

    const formaPagamento = await this.prisma.formaPagamento.update({
      data: {
        nome,
        dataCadastro: new Date(),
        taxa,
        qtdDiasRecebimento,
        codigoContaBancaria,
        usuarioCadastro
      },
      where: {
        id: id
      }
    })

    if (!formaPagamento) {
      throw new Warning('Registro não encontrado, falha na atualização', 400)
    }

    return ['Registro atualizado com sucesso']
  }

  delete = async (id: string): Promise<string[]> => {

    const formaPagamento = await this.prisma.formaPagamento.update({
      data: {
        ativo: false
      },
      where: {
        id: id
      }
    })

    if (!formaPagamento) {
      throw new Warning('Não foi possivel excluir registro, registro não encontrado', 400)
    }

    return ["Registro excluido com sucesso"]
  }
}

export { FormaPagamentoRepository }

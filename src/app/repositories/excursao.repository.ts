import { IExcursao, IExcursaoDTO, IExcursaoResponse } from "../interfaces/Excursao"
import prismaManager from "../database/database"
import { dateValidate } from "../../shared/helper/date"
import { Warning } from "../errors"

class ExcursaoRepository implements IExcursao {

  private prisma = prismaManager.getPrisma()

  create = async ({
    nome,
    dataInicio,
    dataFim,
    observacoes = '',
    ativo = true,
    gerouFinanceiro = false,
    vagas,
    // codigoPassageiro,
    codigoPacote,
    usuarioCadastro,
  }: IExcursaoDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()
      dataInicio = dateValidate(dataInicio)
      dataFim = dateValidate(dataFim)

      const excursao = await this.prisma.excursao.create({
        data: {
          id: id,
          nome: nome,
          dataInicio: dataInicio,
          dataFim: dataFim,
          observacoes: observacoes,
          ativo: ativo,
          gerouFinanceiro: gerouFinanceiro,
          vagas: vagas,
          codigoPacote: codigoPacote,
          usuarioCadastro: usuarioCadastro,
        }
      })

      return ['Excursao criada com sucesso']

    } catch (error) {
      throw new Warning('Erro ao criar excursao', 400)
    }
  }

  find = async (id: string): Promise<IExcursaoResponse> => {

    const excursao = await this.prisma.excursao.findFirst({
      where: {
        id
      },
      select: {
        id: true,
        nome: true,
        dataInicio: true,
        dataFim: true,
        observacoes: true,
        dataCadastro: true,
        ativo: true,
        gerouFinanceiro: true,
        vagas: true,
        codigoPacote: true,
        usuarioCadastro: true,
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        },
        Pacotes: {}
      }
    })

    if (!excursao) {
      throw new Warning('Excursão não encontrada', 400)
    }

    excursao.vagas -= excursao.ExcursaoPassageiros.length

    return excursao
  }

  findAll = async (): Promise<IExcursaoResponse[]> => {

    const excursoes = await this.prisma.excursao.findMany({
      where: {
        ativo: true
      }, select: {
        id: true,
        nome: true,
        dataInicio: true,
        dataFim: true,
        observacoes: true,
        dataCadastro: true,
        ativo: true,
        gerouFinanceiro: true,
        vagas: true,
        codigoPacote: true,
        usuarioCadastro: true,
        ExcursaoPassageiros: {
          include: {
            Pessoa: true,
            LocalEmbarque: true
          }
        },
        Pacotes: {},
      }
    })

    if (!excursoes) {
      throw new Warning("Sem excursões cadastradas na base", 400)
    }

    for (const excursao of excursoes) {
      excursao.vagas -= excursao.ExcursaoPassageiros.length
    }

    return excursoes
  }

  delete = async (id: string): Promise<string> => {

    const excursao = await this.prisma.excursao.update({
      data: {
        ativo: false
      },
      where: {
        id: id
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return id

  }

  update = async ({
    nome,
    dataInicio,
    dataFim,
    observacoes = '',
    gerouFinanceiro = false,
    vagas,
    codigoPacote,
    usuarioCadastro,
  }: IExcursaoDTO, id: string): Promise<string[]> => {

    dataInicio = dateValidate(dataInicio)
    dataFim = dateValidate(dataFim)

    const excursao = await this.prisma.excursao.update({
      data: {
        nome: nome,
        dataInicio: dataInicio,
        dataFim: dataFim,
        observacoes: observacoes,
        dataCadastro: new Date(),
        gerouFinanceiro: gerouFinanceiro,
        vagas: vagas,
        // codigoPassageiro: codigoPassageiro,
        codigoPacote: codigoPacote,
        usuarioCadastro: usuarioCadastro,
      },
      where: {
        id: id
      }
    })

    if (!excursao) {
      throw new Warning('Registro não encontrado', 400)
    }

    return ['Registro atualizado com sucesso']
  }
}

export { ExcursaoRepository }

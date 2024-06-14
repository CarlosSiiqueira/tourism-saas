import { IExcursao, IExcursaoDTO, IExcursaoResponse } from "../interfaces/Excursao"
import prismaManager from "../database/database"
import { dateValidate } from "../../shared/helper/date"

class ExcursaoRepository implements IExcursao {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        dataInicio,
        dataFim,
        observacoes = '',
        dataCadastro,
        ativo = false,
        gerouFinanceiro = false,
        vagas,
        codigoPassageiro,
        codigoPacote,
        usuarioCadastro,
    }: IExcursaoDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)
            dataInicio = dateValidate(dataInicio)
            dataFim = dateValidate(dataFim)

            const excursao = await this.prisma.excursao.create({
                data: {
                    id: id,
                    nome: nome,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    observacoes: observacoes,
                    dataCadastro: dataCadastro,
                    ativo: ativo,
                    gerouFinanceiro: gerouFinanceiro,
                    vagas: vagas,
                    codigoPassageiro: codigoPassageiro,
                    codigoPacote: codigoPacote,
                    usuarioCadastro: usuarioCadastro,
                }
            })

            return ['Excursao criada com sucesso']

        } catch (error) {
            return ['Erro ao criar excursao']
        }
    }

    find = async (id: string): Promise<IExcursaoResponse> => {

        const excursao = await this.prisma.excursao.findUnique({
            where: {
                id
            },
            include: {
                Pessoas: true,
                Pacotes: true
            }
        })

        if (!excursao) {
            throw new Error('Excursão não encontrada')
        }

        return excursao

    }

    findAll = async (): Promise<IExcursaoResponse[]> => {

        const excursoes = await this.prisma.excursao.findMany({
            where: {
                ativo: true
            },
            include: {
                Pessoas: true,
                Pacotes: true
            }
        })

        if (!excursoes) {
            throw new Error("Sem excursões cadastradas na base")
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
            throw new Error('Registro não encontrado')
        }

        return id

    }

    update = async ({
        nome,
        dataInicio,
        dataFim,
        observacoes = '',
        dataCadastro,
        ativo = false,
        gerouFinanceiro = false,
        vagas,
        codigoPassageiro,
        codigoPacote,
        usuarioCadastro,
    }: IExcursaoDTO, id: string): Promise<string[]> => {

        dataCadastro = dateValidate(dataCadastro)
        dataInicio = dateValidate(dataInicio)
        dataFim = dateValidate(dataFim)

        const excursao = await this.prisma.excursao.update({
            data: {
                nome: nome,
                dataInicio: dataInicio,
                dataFim: dataFim,
                observacoes: observacoes,
                dataCadastro: dataCadastro,
                ativo: ativo,
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
            throw new Error('Registro não encontrado')
        }

        return ['Registro atualizado com sucesso']
    }
}

export { ExcursaoRepository }

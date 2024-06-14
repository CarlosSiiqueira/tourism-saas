import { IFormaPagamentoDTO, IFormaPagamento, IFormaPagamentoResponse } from "../interfaces/FormaPagamento"
import prismaManager from "../database/database"
import { dateValidate } from "../../shared/helper/date"

class FormaPagamentoRepository implements IFormaPagamento {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        dataCadastro,
        taxa,
        qtdDiasRecebimento,
        ativo,
        codigoContaBancaria,
        usuarioCadastro
    }: IFormaPagamentoDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const formaPagamento = await this.prisma.formaPagamento.create({
                data: {
                    id,
                    nome,
                    dataCadastro,
                    taxa,
                    qtdDiasRecebimento,
                    ativo,
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
            throw new Error("Forma de pagamento não encontrada")
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
            throw new Error("Forma de pagamento não encontrada")
        }

        return formaPagamento
    }

    update = async ({
        nome,
        dataCadastro,
        taxa,
        qtdDiasRecebimento,
        ativo,
        codigoContaBancaria,
        usuarioCadastro
    }: IFormaPagamentoDTO, id: string): Promise<string[]> => {

        dataCadastro = dateValidate(dataCadastro)

        const formaPagamento = await this.prisma.formaPagamento.update({
            data: {
                nome,
                dataCadastro,
                taxa,
                qtdDiasRecebimento,
                ativo,
                codigoContaBancaria,
                usuarioCadastro
            },
            where: {
                id: id
            }
        })

        if (!formaPagamento) {
            throw new Error('Registro não encontrado, falha na atualização')
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
            throw new Error('Não foi possivel excluir registro, registro não encontrado')
        }

        return ["Registro excluido com sucesso"]
    }
}

export { FormaPagamentoRepository }

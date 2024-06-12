import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { IFinanceiro, IFinanceiroDTO, IFinanceiroResponse } from "../interfaces/Financeiro";

class FinanceiroRepository implements IFinanceiro {

    private prisma = prismaManager.getPrisma()

    create = async ({
        tipo,
        valor,
        vistoAdmin,
        data,
        efetivado,
        observacao = "",
        ativo,
        numeroComprovanteBancario = "",
        codigoPessoa,
        codigoFornecedor,
        codigoExcursao = "",
        codigoProduto = "",
        codigoPacote = "",
        codigoFormaPagamento,
        usuarioCadastro
    }: IFinanceiroDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID();
            data = dateValidate(data)

            const financeiro = await this.prisma.transacoes.create({
                data: {
                    id,
                    tipo,
                    valor,
                    vistoAdmin,
                    data,
                    efetivado,
                    observacao,
                    ativo,
                    numeroComprovanteBancario,
                    codigoPessoa,
                    codigoFornecedor,
                    codigoExcursao,
                    codigoProduto,
                    codigoPacote,
                    codigoFormaPagamento,
                    usuarioCadastro
                }
            })

            return [id]

        } catch (error) {
            return ['Houve um erro ao gerar transação']
        }

    }

    find = async (id: string): Promise<IFinanceiroResponse | null> => {

        const financeiro = await this.prisma.transacoes.findFirst({
            where: {
                id
            },
            include: {
                Pessoas: true,
                Fornecedor: true,
                Excursao: true,
                Produtos: true,
                Pacotes: true,
                FormaPagamento: true,
                Usuarios: true
            }
        })

        if (!financeiro) {
            throw new Error("Transação não encontrada")
        }

        return financeiro

    }

    findAll = async (): Promise<IFinanceiroResponse[]> => {

        const financeiros = await this.prisma.transacoes.findMany({
            where: {
                ativo: true
            },
            include: {
                Pessoas: true,
                Fornecedor: true,
                Excursao: true,
                Produtos: true,
                Pacotes: true,
                FormaPagamento: true,
                Usuarios: true
            }
        })

        return financeiros
    }

    update = async ({
        tipo,
        valor,
        vistoAdmin,
        data,
        efetivado,
        observacao,
        ativo,
        numeroComprovanteBancario,
        codigoPessoa,
        codigoFornecedor,
        codigoExcursao,
        codigoProduto,
        codigoPacote,
        codigoFormaPagamento,
        usuarioCadastro
    }: IFinanceiroDTO, id: string): Promise<string[]> => {

        try {

            data = dateValidate(data)

            const financeiro = await this.prisma.transacoes.update({
                data: {
                    tipo,
                    valor,
                    vistoAdmin,
                    data,
                    efetivado,
                    observacao,
                    ativo,
                    numeroComprovanteBancario,
                    codigoPessoa,
                    codigoFornecedor,
                    codigoExcursao,
                    codigoProduto,
                    codigoPacote,
                    codigoFormaPagamento,
                    usuarioCadastro
                },
                where: {
                    id
                }
            })

            return ['Transação atualizada com sucesso']

        } catch (error) {
            return ['Houve um error ao atualizar transação']
        }
    }

    delete = async (id: string): Promise<string> => {

        const financeiro = await this.prisma.transacoes.delete({
            where: {
                id
            }
        })

        if (!financeiro) {
            return 'Transação não encontrada'
        }

        return id
    }

}

export { FinanceiroRepository }

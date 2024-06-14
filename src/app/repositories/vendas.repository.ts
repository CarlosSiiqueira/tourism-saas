import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { IVendas, IVendasDTO, IVendasResponse } from "../interfaces/Vendas";

class VendasRepository implements IVendas {

    private prisma = prismaManager.getPrisma()

    create = async ({
        valor,
        tipo,
        qtd,
        efetivada = false,
        codigoCliente,
        codigoFormaPagamento,
        codigoProduto = null,
        codigoPacote = null,
        usuarioCadastro
    }: IVendasDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            let data = new Date(Date.now())

            const venda = await this.prisma.vendas.create({
                data: {
                    id,
                    valor,
                    tipo,
                    qtd,
                    efetivada,
                    data,
                    codigoCliente,
                    codigoFormaPagamento,
                    codigoProduto,
                    codigoPacote,
                    usuarioCadastro
                }
            })

            return ['Venda criada com sucesso']

        } catch (error) {
            return ['Não foi possível criar venda']
        }

    }

    find = async (id: string): Promise<IVendasResponse | null> => {

        const venda = await this.prisma.vendas.findUnique({
            where: {
                id
            }
        })

        if (!venda) {
            throw new Error("Venda não encontrada")
        }

        return venda
    }

    findAll = async (): Promise<IVendasResponse[]> => {

        const vendas = await this.prisma.vendas.findMany()

        if (!vendas) {
            throw new Error("Sem vendas na base")
        }

        return vendas
    }

    update = async ({
        valor,
        tipo,
        qtd,
        efetivada,
        codigoCliente,
        codigoFormaPagamento,
        codigoProduto,
        codigoPacote,
        usuarioCadastro
    }: IVendasDTO, id: string): Promise<string[]> => {

        try {

            let data = new Date(Date.now())

            const venda = await this.prisma.vendas.update({
                data: {
                    valor,
                    tipo,
                    qtd,
                    efetivada,
                    data,
                    codigoCliente,
                    codigoFormaPagamento,
                    codigoProduto,
                    codigoPacote,
                    usuarioCadastro
                },
                where: {
                    id
                }
            })

            if (!venda) {
                throw new Error("Venda não encontrada")
            }

            return ['Venda atualizada com sucesso']

        } catch (error) {
            return ['Erro ao atualizar venda']
        }

    }

    delete = async (id: string): Promise<string[]> => {

        const venda = await this.prisma.vendas.delete({
            where: {
                id
            }
        })

        if (!venda) {
            throw new Error("Venda não encontrada")
        }

        return ['Venda excluída com sucesso']
    }

}

export { VendasRepository }
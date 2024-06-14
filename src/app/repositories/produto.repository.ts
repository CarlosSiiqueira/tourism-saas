import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { IProduto, IProdutoDTO, IProdutoResponse } from "../interfaces/Produto"

class ProdutoRepository implements IProduto {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        estoque,
        dataCompra,
        dataCadastro,
        ativo,
        codigoFornecedor,
        usuarioCadastro }: IProdutoDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)
            dataCompra = dateValidate(dataCompra)

            const produto = await this.prisma.produtos.create({
                data: {
                    id,
                    nome,
                    estoque,
                    dataCompra,
                    dataCadastro,
                    ativo,
                    codigoFornecedor,
                    usuarioCadastro
                }
            })

            return ['Produto inserido com sucesso']

        } catch (error) {
            return ['Erro ao inserir produto']
        }
    }

    find = async (id: string): Promise<IProdutoResponse | null> => {

        const produto = await this.prisma.produtos.findUnique({
            where: {
                id
            }
        })

        if (!produto) {
            throw new Error("Produto não encontrada")
        }

        return produto

    }

    findAll = async (): Promise<IProdutoResponse[]> => {

        const produtos = await this.prisma.produtos.findMany({
            where: {
                ativo: true
            }
        })

        if (!produtos) {
            throw new Error("Sem produtos registradas na base")
        }

        return produtos
    }

    update = async ({
        nome,
        estoque,
        dataCompra,
        dataCadastro,
        ativo,
        codigoFornecedor,
        usuarioCadastro }: IProdutoDTO, id: string): Promise<string[]> => {

        try {
            
            dataCadastro = dateValidate(dataCadastro)
            dataCompra = dateValidate(dataCompra)

            const produto = await this.prisma.produtos.update({
                data: {
                    nome,
                    estoque,
                    dataCompra,
                    dataCadastro,
                    ativo,
                    codigoFornecedor,
                    usuarioCadastro
                },
                where: {
                    id
                }
            })

            return ['Produto atualizado com sucesso']

        } catch (error) {
            return ['Erro ao atualizar produto']
        }
    }

    delete = async (id: string): Promise<string[]> => {

        const produto = await this.prisma.produtos.update({
            data: {
                ativo: false
            },
            where: {
                id
            }
        })

        if (!produto) {
            return ['Não foi possível excluir o produto']
        }

        return ['Produto excluido com sucesso']
    }
}

export { ProdutoRepository }

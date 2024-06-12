import prismaManager from "../database/database";
import { IFornecedor, IFornecedorDTO, IFornecedorResponse } from "../interfaces/Fornecedor";

class FornecedorRepository implements IFornecedor {

    private prisma = prismaManager.getPrisma()

    create = async ({
        cnpj,
        site = '',
        ativo = true,
        codigoPessoa,
        usuarioCadastro,
        produtosId = ''
    }: IFornecedorDTO, codigoEndereco: string): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            
            const fornecedor = await this.prisma.fornecedor.create({
                data: {
                    id,
                    cnpj,
                    site,
                    ativo,
                    codigoPessoa,
                    codigoEndereco,
                    usuarioCadastro,
                    produtosId,
                }
            })

            return ['Fornecedor incluído com sucesso']
        } catch (error) {
            return ['Erro ao incluir fornecedor']
        }
    }

    find = async (id: string): Promise<IFornecedorResponse | null> => {

        const fornecedor = await this.prisma.fornecedor.findUnique({
            where: {
                id
            },
            include: {
                Endereco: true,
                Pessoas: true
            }
        })

        if (!fornecedor) {
            throw new Error("Fornecedor não encontrado")
        }

        return fornecedor
    }

    findAll = async (): Promise<IFornecedorResponse[]> => {

        const fornecedores = await this.prisma.fornecedor.findMany({
            where: {
                ativo: true
            },
            include: {
                Endereco: true,
                Pessoas: true
            }
        })

        if (!fornecedores) {
            throw new Error("Sem fornecedores cadastrados na base")
        }

        return fornecedores
    }

    update = async ({
        cnpj,
        site = '',
        codigoPessoa,
        usuarioCadastro,
        produtosId = '',
        codigoEndereco
    }: IFornecedorDTO, id: string): Promise<string[]> => {

        const fornecedor = await this.prisma.fornecedor.update({
            data: {
                cnpj,
                site,
                codigoPessoa,
                codigoEndereco,
                usuarioCadastro,
                produtosId
            },
            where: {
                id
            }
        })

        if (!fornecedor) {
            throw new Error("Fornecedor não encontrado")
        }

        return ['Fornecedor atualizado com sucesso']
    }

    delete = async (id: string): Promise<string[]> => {

        const fornecedor = await this.prisma.fornecedor.update({
            data: {
                ativo: false
            },
            where: {
                id
            }
        })

        if (!fornecedor) {
            throw new Error("Fornecedor não encontrado")
        }

        return ['Fornecedor excluido com sucesso']
    }

}

export { FornecedorRepository }

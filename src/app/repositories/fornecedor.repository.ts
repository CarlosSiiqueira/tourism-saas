import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { IFornecedor, IFornecedorDTO, IFornecedorResponse } from "../interfaces/Fornecedor";

class FornecedorRepository implements IFornecedor {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        fantasia,
        cnpj,
        site = '',
        ativo,
        dataCadastro,
        observacoes = '',
        telefone = '',
        email,
        contato = '',
        telefoneContato = '',
        codigoEndereco,
        usuarioCadastro
    }: IFornecedorDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const fornecedor = await this.prisma.fornecedor.create({
                data: {
                    id,
                    nome,
                    fantasia,
                    cnpj,
                    site,
                    ativo,
                    dataCadastro,
                    observacoes,
                    telefone,
                    email,
                    contato,
                    telefoneContato,
                    codigoEndereco,
                    usuarioCadastro
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
            }
        })

        if (!fornecedores) {
            throw new Error("Sem fornecedores cadastrados na base")
        }

        return fornecedores
    }

    update = async ({
        nome,
        fantasia,
        cnpj,
        site,
        ativo,
        dataCadastro,
        observacoes,
        telefone,
        email,
        contato,
        telefoneContato,
        codigoEndereco,
        usuarioCadastro
    }: IFornecedorDTO, id: string): Promise<string[]> => {

        const fornecedor = await this.prisma.fornecedor.update({
            data: {
                nome,
                fantasia,
                cnpj,
                site,
                ativo,
                dataCadastro,
                observacoes,
                telefone,
                email,
                contato,
                telefoneContato,
                codigoEndereco,
                usuarioCadastro
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

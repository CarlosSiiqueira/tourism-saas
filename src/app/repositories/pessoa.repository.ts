import prismaManager from "../database/database";
import { IPessoa, IPessoaDTO, IPessoaResponse } from "../interfaces/Pessoa";
import { dateValidate } from "../../shared/helper/date";

class PessoaRepository implements IPessoa {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        cpf,
        sexo,
        dataCadastro,
        observacoes = '',
        telefone = '',
        telefoneWpp = '',
        email,
        contato = '',
        telefoneContato = '',
        ativo = true,
        dataNascimento = new Date(),
        usuarioCadastro }: IPessoaDTO, codigoEndereco: string): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)
            
            if (dataNascimento) {
                dataNascimento = dateValidate(dataNascimento)
            }

            const pessoa = await this.prisma.pessoas.create({
                data: {
                    id,
                    nome,
                    cpf,
                    sexo,
                    dataCadastro,
                    observacoes,
                    telefone,
                    telefoneWpp,
                    email,
                    contato,
                    telefoneContato,
                    ativo,
                    dataNascimento,
                    usuarioCadastro,
                    Endereco: {
                        connect: {
                            id: codigoEndereco
                        }
                    }
                }
            })

            return ['Pessoa inserida com sucesso']

        } catch (error) {
            return ['Erro ao inserir pessoa']
        }

    }

    find = async (id: string): Promise<IPessoaResponse | null> => {

        const pessoa = await this.prisma.pessoas.findFirst({
            where: {
                id
            },
            include: {
                Endereco: true
            }
        })

        if (!pessoa) {
            throw new Error("Pessoa não encontrada")
        }

        return pessoa

    }

    findAll = async (): Promise<IPessoaResponse[]> => {

        const pessoas = await this.prisma.pessoas.findMany({
            where: {
                ativo: true
            },
            include: {
                Endereco: true
            }
        })

        if (!pessoas) {
            throw new Error("Sem pessoas registradas na base")
        }

        return pessoas
    }

    update = async ({
        nome,
        cpf,
        sexo,
        dataCadastro,
        observacoes = '',
        telefone = '',
        telefoneWpp = '',
        email,
        contato = '',
        telefoneContato = '',
        ativo = true,
        dataNascimento = new Date(),
        usuarioCadastro }: IPessoaDTO, id: string): Promise<string[]> => {

        try {

            const pessoa = await this.prisma.pessoas.update({
                data: {
                    nome,
                    cpf,
                    sexo,
                    dataCadastro,
                    observacoes,
                    telefone,
                    telefoneWpp,
                    email,
                    contato,
                    telefoneContato,
                    ativo,
                    dataNascimento,
                    usuarioCadastro
                },
                where: {
                    id
                }
            })

            return ['Pessoa atualizada com sucesso']

        } catch (error) {
            return ['Erro ao atualizar pessoa']
        }
    }

    delete = async (id: string): Promise<string[]> => {

        const pessoa = await this.prisma.pessoas.update({
            data: {
                ativo: false
            },
            where: {
                id
            }
        })

        if (!pessoa) {
            return ['Não foi possível excluir pessoa']
        }

        return ['Pessoa excluida com sucesso']
    }
}

export { PessoaRepository }

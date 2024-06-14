import prismaManager from "../database/database"
import { IEndereco, IEnderecoDTO, IEnderecoResponse } from "../interfaces/Endereco"

class EnderecoRepository implements IEndereco {

    private prisma = prismaManager.getPrisma()

    create = async ({
        logradouro,
        numero,
        complemento = '',
        cep,
        cidade,
        uf }: IEnderecoDTO): Promise<string> => {

        try {

            const id = crypto.randomUUID()

            const endereco = await this.prisma.endereco.create({
                data: {
                    id,
                    logradouro,
                    numero,
                    complemento,
                    cep,
                    cidade,
                    uf
                }
            })

            return id

        } catch (error) {
            throw new Error("Erro ao inserir endereço");
        }
    }

    find = async (id: string): Promise<IEnderecoResponse | null> => {

        const endereco = await this.prisma.endereco.findUnique({
            where: {
                id
            }
        })

        if (!endereco) {
            throw new Error("Endereco não encontrado")
        }

        return endereco

    }

    findAll = async (): Promise<IEnderecoResponse[]> => {

        const enderecos = await this.prisma.endereco.findMany()

        if (!enderecos) {
            throw new Error("Sem Enderecos registradas na base")
        }

        return enderecos
    }

    findByCepAndNumber = async (cep: string, numero: string): Promise<IEnderecoResponse | null> => {

        const endereco = await this.prisma.endereco.findFirst({
            where: {
                cep,
                numero
            }
        })

        return endereco
    }

    update = async ({
        logradouro,
        numero,
        complemento,
        cep,
        cidade,
        uf }: IEnderecoDTO, id: string): Promise<string[]> => {

        try {

            const endereco = await this.prisma.endereco.update({
                data: {
                    logradouro,
                    numero,
                    complemento,
                    cep,
                    cidade,
                    uf
                },
                where: {
                    id
                }
            })

            return ['Endereco atualizado com sucesso']

        } catch (error) {
            return ['Erro ao atualizar Endereco']
        }
    }

    delete = async (id: string): Promise<string[]> => {

        const endereco = await this.prisma.endereco.delete({
            where: {
                id
            }
        })

        if (!endereco) {
            return ['Não foi possível excluir o Endereco']
        }

        return ['Endereco excluido com sucesso']
    }
}

export { EnderecoRepository }

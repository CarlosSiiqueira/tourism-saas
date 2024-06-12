import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { IPacote, IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"

class PacoteRepository implements IPacote {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        valor,
        descricao,
        ativo,
        dataCadastro,
        origem,
        codigoLocalEmbarque,
        codigoDestino,
        usuarioCadastro }: IPacoteDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const pacote = await this.prisma.pacotes.create({
                data: {
                    id,
                    nome,
                    valor,
                    descricao,
                    ativo,
                    dataCadastro,
                    origem,
                    codigoLocalEmbarque,
                    codigoDestino,
                    usuarioCadastro,
                }
            })

            return ['Pacote criado com sucesso']

        } catch (error) {
            return ['Não foi possivel inserir o pacote']
        }
    }

    find = async (id: string): Promise<IPacoteResponse> => {

        const pacote = await this.prisma.pacotes.findFirst({
            where: {
                id
            }
        })

        if (!pacote) {
            throw new Error("Pacote não encontrado")
        }

        return pacote
    }

    findAll = async (): Promise<IPacoteResponse[]> => {

        const pacotes = await this.prisma.pacotes.findMany({
            where: {
                ativo: true
            }
        })

        return pacotes
    }

    update = async ({
        nome,
        valor,
        descricao,
        ativo,
        dataCadastro,
        origem,
        codigoLocalEmbarque,
        codigoDestino,
        usuarioCadastro }: IPacoteDTO, id: string): Promise<string[]> => {

        try {

            dataCadastro = dateValidate(dataCadastro)
            
            const pacote = await this.prisma.pacotes.update({
                data: {
                    nome,
                    valor,
                    descricao,
                    ativo,
                    dataCadastro,
                    origem,
                    codigoLocalEmbarque,
                    codigoDestino,
                    usuarioCadastro
                },
                where: {
                    id
                }
            })

            return ['Pacote atualizado com sucesso']

        } catch (error) {
            return ['Erro ao atualizar pacote']
        }
    }

    delete = async (id: string): Promise<string[]> => {

        try {

            const pacote = await this.prisma.pacotes.update({
                data: {
                    ativo: false
                },
                where: {
                    id
                }
            })

            return ['Pacote excluido com sucesso']
        } catch (error) {
            return ['Ocorreu um erro ao excluir pacote']
        }
    }

}

export { PacoteRepository }

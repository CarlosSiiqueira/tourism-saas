import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { ILocalEmbarque, ILocalEmbarqueDTO, ILocalEmbarqueResponse } from "../interfaces/LocalEmbarque"

class LocalEmbarqueRepository implements ILocalEmbarque {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        observacoes,
        horaEmbarque,
        dataCadastro,
        codigoEndereco,
        usuarioCadastro,
        ativo = true }: ILocalEmbarqueDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const localEmbarque = await this.prisma.localEmbarque.create({
                data: {
                    id,
                    nome,
                    observacoes,
                    horaEmbarque,
                    dataCadastro,
                    codigoEndereco,
                    usuarioCadastro,
                    ativo
                }
            })

            return ['LocalEmbarque inserido com sucesso']

        } catch (error) {
            return ['Erro ao inserir LocalEmbarque']
        }
    }

    find = async (id: string): Promise<ILocalEmbarqueResponse | null> => {

        const localEmbarque = await this.prisma.localEmbarque.findFirst({
            where: {
                id
            }
        })

        if (!localEmbarque) {
            throw new Error("Local de embarque não encontrada")
        }

        return localEmbarque

    }

    findAll = async (): Promise<ILocalEmbarqueResponse[]> => {

        const localEmbarques = await this.prisma.localEmbarque.findMany({
            where: {
                ativo: true
            }
        })

        if (!localEmbarques) {
            throw new Error("Sem Local de embarques registradas na base")
        }

        return localEmbarques
    }

    update = async ({
        nome,
        observacoes,
        horaEmbarque,
        dataCadastro,
        codigoEndereco,
        usuarioCadastro,
        ativo }: ILocalEmbarqueDTO, id: string): Promise<string[]> => {

        try {

            const localEmbarque = await this.prisma.localEmbarque.update({
                data: {
                    nome,
                    observacoes,
                    horaEmbarque,
                    dataCadastro,
                    codigoEndereco,
                    usuarioCadastro,
                    ativo
                },
                where: {
                    id
                }
            })

            return ['Local de embarque atualizado com sucesso']

        } catch (error) {
            return ['Erro ao atualizar LocalEmbarque']
        }
    }

    delete = async (id: string): Promise<string[]> => {

        const localEmbarque = await this.prisma.localEmbarque.update({
            data: {
                ativo: false
            },
            where: {
                id
            }
        })

        if (!localEmbarque) {
            return ['Não foi possível excluir o Local de embarque']
        }

        return ['Local de embarque excluido com sucesso']
    }
}

export { LocalEmbarqueRepository }

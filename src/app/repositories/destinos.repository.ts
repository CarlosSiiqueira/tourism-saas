import { dateValidate } from "../../shared/helper/date";
import prismaManager from "../database/database";
import { IDestinos, IDestinosDTO, IDestinosResponse } from "../interfaces/Destinos";

class DestinosRepository implements IDestinos {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        ativo,
        dataCadastro,
        codigoEndereco,
        usuarioCadastro,
    }: IDestinosDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const destino = await this.prisma.destinos.create({
                data: {
                    id,
                    nome,
                    ativo,
                    dataCadastro,
                    codigoEndereco,
                    usuarioCadastro
                }
            })

            return ['Destino criado com sucesso']

        } catch (error) {
            return ['Erro ao criar destino']
        }

    }

    find = async (id: string): Promise<IDestinosResponse | null> => {

        const destino = await this.prisma.destinos.findUnique({
            where: {
                id
            }
        })

        if (!destino) {
            throw new Error("Destino não encontrado")
        }

        return destino

    }

    findAll = async (): Promise<IDestinosResponse[]> => {

        const destinos = await this.prisma.destinos.findMany({
            where: {
                ativo: true
            }
        })

        if (!destinos) {
            throw new Error("Sem destinos cadastrados na base")
        }

        return destinos

    }

    update = async ({
        nome,
        ativo,
        dataCadastro,
        codigoEndereco,
        usuarioCadastro
    }: IDestinosDTO, id: string): Promise<string[]> => {

        dataCadastro = dateValidate(dataCadastro)

        const destino = await this.prisma.destinos.update({
            data: {
                nome,
                ativo,
                dataCadastro,
                codigoEndereco,
                usuarioCadastro
            },
            where: {
                id
            }
        })

        if (!destino) {
            return ['Erro ao atualizar destino']
        }

        return ['Destino atualizado com sucesso']

    }

    delete = async (id: string): Promise<string[]> => {

        const destino = await this.prisma.destinos.update({
            data: {
                ativo: false
            },
            where: {
                id
            }
        })

        if (!destino) {
            throw new Error("Não foi possivel excluir Destino")
        }

        return ['Destino excluído com sucesso']

    }

}

export { DestinosRepository }

import prismaManager from "../database/database"
import { IExcursaoQuartos, IExcursaoQuartosDTO, IExcursaoQuartosResponse } from "../interfaces/ExcursaoQuartos"
import { dateValidate } from "../../shared/helper/date"

class ExcursaoQuartosRepository implements IExcursaoQuartos {

    private prisma = prismaManager.getPrisma()

    create = async ({
        numeroQuarto,
        dataCadastro,
        codigoExcursao,
        codigoPassageiro,
        usuarioCadastro
    }: IExcursaoQuartosDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const excursaoQuartos = await this.prisma.excursaoQuartos.create({
                data: {
                    id: id,
                    numeroQuarto: numeroQuarto,
                    dataCadastro: dataCadastro,
                    codigoExcursao: codigoExcursao,
                    usuarioCadastro: usuarioCadastro,
                    codigoPassageiro: codigoPassageiro
                }
            })

            if (!excursaoQuartos) {
                throw new Error('excursao sem quartos configurados')
            }

            return ['Quartos definidos com sucesso']
        } catch (error) {
            return ['Erro ao registrar quarto']
        }
    }

    find = async (idExcursao: string): Promise<IExcursaoQuartosResponse[]> => {

        const excursaoQuartos = await this.prisma.excursaoQuartos.findMany({
            where: {
                codigoExcursao: idExcursao
            },
            include: {
                Passageiro: true,
                Excursao: true
            }
        })

        if (!excursaoQuartos) {
            throw new Error('não existem quartos definidos para essa excursao')
        }

        return excursaoQuartos
    }

    update = async ({
        numeroQuarto,
        dataCadastro,
        codigoExcursao,
        codigoPassageiro,
        usuarioCadastro }: IExcursaoQuartosDTO, id: string): Promise<string[]> => {

        dataCadastro = dateValidate(dataCadastro)

        const excursaoQuartos = await this.prisma.excursaoQuartos.update({
            data: {
                numeroQuarto: numeroQuarto,
                dataCadastro: dataCadastro,
                // codigoExcursao: codigoExcursao,
                codigoPassageiro: codigoPassageiro,
                usuarioCadastro: usuarioCadastro
            },
            where: {
                id: id
            }
        })

        if (!excursaoQuartos) {
            throw new Error('registro não encontrado')
        }

        return ['Registro atualizado com sucesso']
    }
}

export { ExcursaoQuartosRepository }

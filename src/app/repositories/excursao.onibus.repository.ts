import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { IExcursaoOnibus, IExcursaoOnibusDTO, IExcursaoOnibusResponse } from "../interfaces/ExcursaoOnibus"

class ExcursaoOnibusRepository implements IExcursaoOnibus {

    private prisma = prismaManager.getPrisma()

    create = async ({
        numeroCadeira,
        dataCadastro,
        codigoExcursao,
        codigoPassageiro,
        usuarioCadastro
    }: IExcursaoOnibusDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const excursaoOnibus = await this.prisma.excursaoOnibus.create({
                data: {
                    id: id,
                    numeroCadeira: numeroCadeira,
                    dataCadastro: dataCadastro,
                    codigoExcursao: codigoExcursao,
                    usuarioCadastro: usuarioCadastro,
                    codigoPassageiro: codigoPassageiro
                }
            })

            if (!excursaoOnibus) {
                throw new Error('excursao sem Onibus configurados')
            }

            return ['Onibus definidos com sucesso']
        } catch (error) {
            return ['']
        }
    }

    find = async (idExcursao: string): Promise<IExcursaoOnibusResponse[]> => {

        const excursaoOnibus = await this.prisma.excursaoOnibus.findMany({
            where: {
                codigoExcursao: idExcursao
            }
        })

        if (!excursaoOnibus) {
            throw new Error('não existem Onibus definidos para essa excursao')
        }

        return excursaoOnibus
    }

    update = async ({
        numeroCadeira,
        dataCadastro,
        codigoExcursao,
        codigoPassageiro,
        usuarioCadastro }: IExcursaoOnibusDTO, id: string): Promise<string[]> => {

        dataCadastro = dateValidate(dataCadastro)

        const excursaoOnibus = await this.prisma.excursaoOnibus.update({
            data: {
                numeroCadeira: numeroCadeira,
                dataCadastro: dataCadastro,
                codigoExcursao: codigoExcursao,
                codigoPassageiro: codigoPassageiro,
                usuarioCadastro: usuarioCadastro
            },
            where: {
                id: id
            }
        })

        if (!excursaoOnibus) {
            throw new Error('registro não encontrado')
        }

        return ['Registro atualizado com sucesso']
    }
}

export { ExcursaoOnibusRepository }

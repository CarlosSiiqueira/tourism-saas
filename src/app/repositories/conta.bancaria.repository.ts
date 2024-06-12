import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { IContaBancaria, IContaBancariaDTO, IContaBancariaResponse } from "../interfaces/ContaBancaria"

class ContaBancariaRepository implements IContaBancaria {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        ativo,
        saldo = 0,
        dataCadastro,
        usuarioCadastro
    }: IContaBancariaDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            await this.prisma.contaBancaria.create({
                data: {
                    id,
                    nome,
                    ativo,
                    saldo,
                    dataCadastro,
                    usuarioCadastro
                }
            })

            return ['Conta bancária cadastrada com sucesso!']


        } catch (error) {
            const a = error
            return ['not found']
        }
    }

    find = async (id: string): Promise<IContaBancariaResponse> => {

        const contaBancaria = await this.prisma.contaBancaria.findUnique({
            where: {
                id
            }
        })

        if (!contaBancaria) {
            throw new Error("Conta não encontrada");
        }

        return contaBancaria
    }

    findAll = async (): Promise<IContaBancariaResponse[]> => {

        const contasBancarias = await this.prisma.contaBancaria.findMany({
            where: {
                ativo: true
            }
        })

        if (!contasBancarias) {
            throw new Error("Sem contas cadastradas na base")
        }

        return contasBancarias
    }

    delete = async (id: string): Promise<string> => {

        const contaBancaria = await this.prisma.contaBancaria.update({
            data: {
                ativo: false
            },
            where: {
                id: id
            }
        })

        if (!contaBancaria) {
            throw new Error('Registro não encontrado')
        }

        return id

    }

    update = async ({
        nome,
        ativo,
        saldo,
        dataCadastro,
        usuarioCadastro
    }: IContaBancariaDTO, id: string): Promise<string[]> => {

        dataCadastro = dateValidate(dataCadastro)
        
        const contaBancaria = await this.prisma.contaBancaria.update({
            data: {
                nome: nome,
                ativo: ativo,
                saldo: saldo,
                dataCadastro: dataCadastro,
                usuarioCadastro: usuarioCadastro
            },
            where: {
                id: id
            }
        })

        if (!contaBancaria) {
            throw new Error('Registro não encontrado')
        }

        return ['Registro Atualizado com sucesso'];
    }
}

export { ContaBancariaRepository }

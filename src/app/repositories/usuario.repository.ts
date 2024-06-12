import { dateValidate } from "../../shared/helper/date"
import prismaManager from "../database/database"
import { IUsuario, IUsuarioDTO, IUsuarioResponse, IUsuarioLogin } from "../interfaces/Usuario"

class UsuarioRepository implements IUsuario {

    private prisma = prismaManager.getPrisma()

    create = async ({
        nome,
        username,
        password,
        dataCadastro,
        usuarioCadastro,
        tipo,
        email,
        ativo = true,
        comissao = null,
        meta = null }: IUsuarioDTO): Promise<string[]> => {

        try {

            const id = crypto.randomUUID()
            dataCadastro = dateValidate(dataCadastro)

            const usuario = await this.prisma.usuarios.create({
                data: {
                    id,
                    nome,
                    username,
                    password,
                    dataCadastro,
                    usuarioCadastro,
                    tipo,
                    email,
                    ativo,
                    comissao,
                    meta
                }
            })

            return ['Usuario inserido com sucesso']

        } catch (error) {
            return ['Erro ao inserir Usuario']
        }
    }

    find = async (id: string): Promise<IUsuarioResponse | null> => {

        const usuario = await this.prisma.usuarios.findUnique({
            where: {
                id: id,
                ativo: true
            }
        })

        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        return usuario

    }

    findAll = async (): Promise<IUsuarioResponse[]> => {

        const usuarios = await this.prisma.usuarios.findMany({
            where: {
                ativo: true
            }
        })

        if (!usuarios) {
            throw new Error("Sem usuários ativos na base")
        }

        return usuarios
    }

    update = async ({
        nome,
        username,
        password,
        dataCadastro,
        usuarioCadastro,
        tipo,
        email,
        ativo,
        comissao,
        meta }: IUsuarioDTO, id: string): Promise<string[]> => {

        try {

            const usuario = await this.prisma.usuarios.update({
                data: {
                    nome,
                    username,
                    password,
                    dataCadastro,
                    usuarioCadastro,
                    tipo,
                    email,
                    ativo,
                    comissao,
                    meta
                },
                where: {
                    id
                }
            })

            return ['Usuário atualizado com sucesso']

        } catch (error) {
            return ['Erro ao atualizar usuário']
        }
    }

    delete = async (id: string): Promise<string[]> => {

        const usuario = await this.prisma.usuarios.update({
            data: {
                ativo: false
            },
            where: {
                id
            }
        })

        if (!usuario) {
            return ['Não foi possível excluir o usuário']
        }

        return ['Usuário excluido com sucesso']
    }

    login = async (username: string, password: string): Promise<IUsuarioResponse | null> => {

        const usuario = await this.prisma.usuarios.findFirst({
            where: {
                username: username,
                password: password
            }
        })

        return usuario
    }
}

export { UsuarioRepository }

import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IUsuario, IUsuarioDTO, IUsuarioResponse, IUsuarioLogin } from "../interfaces/Usuario"

class UsuarioRepository implements IUsuario {

  private prisma = prismaManager.getPrisma()

  create = async ({
    nome,
    username,
    password,
    usuarioCadastro,
    tipo,
    email,
    comissao = null,
    meta = null }: IUsuarioDTO): Promise<string[]> => {

    try {

      const id = crypto.randomUUID()

      const usuario = await this.prisma.usuarios.create({
        data: {
          id,
          nome,
          username,
          password,
          usuarioCadastro,
          tipo,
          email,
          comissao,
          meta
        }
      })

      return ['Usuario inserido com sucesso']

    } catch (error) {
      throw new Warning('Erro ao inserir Usuario', 400)
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
      throw new Warning("Usuario não encontrado", 400)
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
      throw new Warning("Sem usuários ativos na base", 400)
    }

    return usuarios
  }

  update = async ({
    nome,
    username,
    password,
    usuarioCadastro,
    tipo,
    email,
    comissao,
    meta }: IUsuarioDTO, id: string): Promise<string[]> => {

    try {

      const usuario = await this.prisma.usuarios.update({
        data: {
          nome,
          username,
          password,
          dataCadastro: new Date(),
          usuarioCadastro,
          tipo,
          email,
          comissao,
          meta
        },
        where: {
          id
        }
      })

      return ['Usuário atualizado com sucesso']

    } catch (error) {
      throw new Warning('Erro ao atualizar usuário', 400)
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
      throw new Warning('Não foi possível excluir o usuário', 400)
    }

    return ['Usuário excluido com sucesso']
  }

  login = async (username: string, password: string): Promise<IUsuarioResponse> => {

    const usuario = await this.prisma.usuarios.findFirst({
      where: {
        username: username,
        password: password
      }
    })

    if (!usuario) {
      throw new Warning("Login ou senha incorretos", 401)
    }

    return usuario
  }
}

export { UsuarioRepository }

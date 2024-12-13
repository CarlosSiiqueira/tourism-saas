import { generatePassword, verifyPassword } from "../../shared/utils/encrypt"
import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IIndex } from "../interfaces/Helper"
import { IUsuario, IUsuarioDTO, IUsuarioResponse, IUsuarioLogin, IUsuarioFilter, IUsuarioChangePassword } from "../interfaces/Usuario"
import crypto from 'crypto'

class UsuarioRepository implements IUsuario {

  private prisma = prismaManager.getPrisma()

  index = async ({ orderBy, order, skip, take, filter }: IIndex): Promise<{ count: number, rows: IUsuarioResponse[] }> => {

    const where = {
      ativo: true
    }

    let filterOR: IUsuarioFilter[] = []

    Object.entries(filter as { [key: string]: string }).map(([key, value]) => {

      switch (key) {
        case 'nome':
          filterOR.push(
            {
              nome: {
                contains: value,
                mode: "insensitive"
              }
            }
          )
          break;

        case 'status':
          if (value !== 'all') {
            Object.assign(where, {
              ativo: parseInt(value) == 1 ? true : false
            })
          }
          break
      }
    })

    if (filterOR.length) {
      Object.assign(where, {
        OR: filterOR
      })
    }

    const [count, rows] = await this.prisma.$transaction([
      this.prisma.usuarios.count({ where }),
      this.prisma.usuarios.findMany({
        skip,
        take,
        orderBy: {
          [orderBy as string]: order
        },
        where,
      })
    ])

    return { count, rows }
  }

  create = async ({
    nome,
    username,
    password,
    usuarioCadastro,
    tipo,
    email,
    comissao = null,
    meta = null }: IUsuarioDTO): Promise<string> => {

    try {

      const id = crypto.randomUUID()

      const pass = generatePassword(password)

      await this.prisma.usuarios.create({
        data: {
          id,
          nome,
          username,
          password: pass.password,
          salt: pass.salt,
          usuarioCadastro,
          tipo,
          email,
          comissao,
          meta
        }
      })

      return id

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
    meta }: IUsuarioDTO, id: string): Promise<IUsuarioResponse> => {

    try {

      const pass = generatePassword(password)

      const usuario = await this.prisma.usuarios.update({
        data: {
          nome,
          username,
          password: pass.password,
          salt: pass.salt,
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

      return usuario

    } catch (error) {
      throw new Warning('Erro ao atualizar usuário', 400)
    }
  }

  delete = async (id: string): Promise<IUsuarioResponse> => {

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

    return usuario
  }

  login = async (username: string, password: string): Promise<IUsuarioResponse> => {

    const usuario = await this.prisma.usuarios.findUnique({
      where: {
        username,
        tipo: {
          in: [1, 2]
        }
      }
    })

    if (!usuario) {
      throw new Warning("Login ou senha incorretos", 401)
    }

    const passwordVerified = verifyPassword(password, usuario.salt || "", usuario.password)

    if (!passwordVerified) {
      throw new Warning("Login ou senha incorretos", 401)
    }

    return usuario
  }

  loginUserClient = async (username: string, password: string): Promise<IUsuarioResponse> => {

    const user = await this.prisma.usuarios.findUnique({
      where: {
        username,
        tipo: 3
      }
    })

    if (!user) {
      throw new Warning("Login ou senha incorretos", 401)
    }

    const passwordVerified = verifyPassword(password, user.salt || "", user.password)

    if (!passwordVerified) {
      throw new Warning("Login ou senha incorretos", 401)
    }

    return user
  }

  changePassword = async (id: string, data: IUsuarioChangePassword): Promise<IUsuarioResponse> => {
    const { password, confirmationPassword } = data

    if (password !== confirmationPassword) {
      throw new Warning("Senha e confirme a senha estão diferentes")
    }

    const usuario = await this.prisma.usuarios.findUnique({
      where: {
        id
      }
    })

    if (!usuario) {
      throw new Warning("Usuário não encontrado", 401)
    }

    const pass = generatePassword(password)

    return await this.prisma.usuarios.update({
      data: {
        password: pass.password,
        salt: pass.salt
      },
      where: {
        id
      }
    })
  }

}

export { UsuarioRepository }

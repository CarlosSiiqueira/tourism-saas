import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"
import { UsuarioRepository } from "../repositories/usuario.repository";

const usuarioRepository = new UsuarioRepository()
const authService = new AuthService(usuarioRepository)

const authenticateToken = async (request: Request, response: Response, next: NextFunction) => {

  const noAuthRoutes = [
    "/usuarios/login",
    "/usuarios/auth",
    "/usuarios/login-user-client",
    "/passageiro-embarque/embarque-qrcode"
  ]

  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    let access = false
    noAuthRoutes.map(path => {

      if (request.path == path) {
        access = true
      }

      if (request.path.includes('images')) {
        access = true
      }

    })

    if (!access) {
      return response.sendStatus(401)
    }
    return next()
  }

  const user = await authService.verifyToken(authHeader);

  if (!user) {
    response.sendStatus(401)
    return null
  }

  request.headers = {
    ...request.headers,
    user: JSON.stringify(user.user)
  }

  next()
}

export { authenticateToken }

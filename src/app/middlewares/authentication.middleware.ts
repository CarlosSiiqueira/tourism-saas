import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"
import { UsuarioRepository } from "../repositories/usuario.repository";

const usuarioRepository = new UsuarioRepository()
const authService = new AuthService(usuarioRepository)

const authenticateToken = async (request: Request, response: Response, next: NextFunction) => {

  const noAuthRoutes = [
    "/usuarios/login",
    "/usuarios/auth"
  ]

  const authHeader = request.headers['authorization'];

  if (process.env.WEBHOOK_SECRET == request.headers['x-wc-webhook-signature']) {
    return next()
  }

  if (!authHeader) {
    let access = false
    noAuthRoutes.map(path => {

      if (request.path == path) {
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
    user: JSON.stringify(user)
  }

  next()
}

export { authenticateToken }

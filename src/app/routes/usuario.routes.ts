import { Router } from "express"
import { usuarioController } from "../controllers"

const usuario = Router()


usuario.get('/index', usuarioController.index)
usuario.get('/find/:id', usuarioController.find)
usuario.get('/findAll', usuarioController.findAll)
usuario.post('/create', usuarioController.create)
usuario.put('/update/:id', usuarioController.update)
usuario.patch('/delete/:id', usuarioController.delete)
usuario.post('/login', usuarioController.login)
usuario.post('/auth', usuarioController.auth)
usuario.patch('/change-password/:id', usuarioController.changePassword)

export { usuario }

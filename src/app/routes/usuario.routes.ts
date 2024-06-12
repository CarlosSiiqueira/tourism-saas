import { Router } from "express"
import { usuarioController } from "../controllers"

const usuario = Router()


usuario.get('/find/:id', usuarioController.find)
usuario.get('/findAll', usuarioController.findAll)
usuario.post('/create', usuarioController.create)
usuario.put('/update/:id', usuarioController.update)
usuario.patch('/delete', usuarioController.delete)
usuario.post('/login', usuarioController.login)
usuario.post('/auth', usuarioController.auth)

export { usuario }

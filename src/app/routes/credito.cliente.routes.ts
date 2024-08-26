import { Router } from "express"
import { creditoClienteController } from "../controllers"

const creditoCliente = Router()

creditoCliente.get('/index', creditoClienteController.index)
creditoCliente.post('/create', creditoClienteController.create)
creditoCliente.get('/find/:id', creditoClienteController.find)
creditoCliente.get('/findAll', creditoClienteController.findAll)
creditoCliente.put('/update/:id', creditoClienteController.update)
creditoCliente.patch('/delete/:id', creditoClienteController.delete)

export { creditoCliente }

import { Router } from "express"
import { enderecoController } from "../controllers"

const endereco = Router()

endereco.get('/find/:id', enderecoController.find)
endereco.get('/findAll', enderecoController.findAll)
endereco.post('/create', enderecoController.create)
endereco.put('/update/:id', enderecoController.update)
endereco.patch('/delete', enderecoController.delete)

export { endereco }

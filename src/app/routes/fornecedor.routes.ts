import { Router } from "express"
import { fornecedorController } from "../controllers"

const fornecedor = Router()


fornecedor.get('/find/:id', fornecedorController.find)
fornecedor.get('/findAll', fornecedorController.findAll)
fornecedor.post('/create', fornecedorController.create)
fornecedor.put('/update/:id', fornecedorController.update)
fornecedor.patch('/delete', fornecedorController.delete)

export { fornecedor }

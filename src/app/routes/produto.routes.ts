import { Router } from "express"
import { produtoController } from "../controllers"

const produto = Router()

produto.get('/find/:id', produtoController.find)
produto.get('/findAll', produtoController.findAll)
produto.post('/create', produtoController.create)
produto.put('/update/:id', produtoController.update)
produto.patch('/delete', produtoController.delete)

export { produto }

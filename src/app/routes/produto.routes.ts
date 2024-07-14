import { Router } from "express"
import { produtoController } from "../controllers"

const produto = Router()

produto.get('/index', produtoController.index)
produto.get('/find/:id', produtoController.find)
produto.get('/findAll', produtoController.findAll)
produto.post('/create', produtoController.create)
produto.put('/update/:id', produtoController.update)
produto.patch('/delete/:id', produtoController.delete)

export { produto }

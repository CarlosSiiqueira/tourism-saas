import { Router } from "express"
import { vendasController } from "../controllers"

const vendas = Router()


vendas.get('/find/:id', vendasController.find)
vendas.get('/findAll', vendasController.findAll)
vendas.post('/create', vendasController.create)
vendas.put('/update/:id', vendasController.update)
vendas.delete('/delete/:id', vendasController.delete)

export { vendas }

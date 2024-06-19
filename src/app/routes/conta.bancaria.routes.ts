import { Router } from "express"
import { contaBancariaController } from "../controllers"

const contaBancaria = Router()

contaBancaria.get('/index', contaBancariaController.index)
contaBancaria.post('/create', contaBancariaController.create)
contaBancaria.get('/find/:id', contaBancariaController.find)
contaBancaria.get('/findAll', contaBancariaController.findAll)
contaBancaria.put('/update/:id', contaBancariaController.update)
contaBancaria.patch('/delete/:id', contaBancariaController.delete)

export { contaBancaria }

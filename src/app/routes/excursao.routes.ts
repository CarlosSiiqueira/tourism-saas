import { Router } from "express"
import { excursaoController } from "../controllers"

const excursao = Router()

excursao.get('/index', excursaoController.index)
excursao.post('/create', excursaoController.create)
excursao.get('/find/:id', excursaoController.find)
excursao.get('/findAll', excursaoController.findAll)
excursao.put('/update/:id', excursaoController.update)
excursao.patch('/delete/:id', excursaoController.delete)

export { excursao }

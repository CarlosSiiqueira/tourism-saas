import { Router } from "express"
import { excursaoPassageirosController } from "../controllers"

const excursaoPassageiros = Router()

excursaoPassageiros.get('/index', excursaoPassageirosController.index)
excursaoPassageiros.post('/create', excursaoPassageirosController.create)
excursaoPassageiros.get('/find/:id', excursaoPassageirosController.find)
excursaoPassageiros.get('/findAll', excursaoPassageirosController.findAll)
excursaoPassageiros.delete('/delete/:idPassageiro/:idExcursao', excursaoPassageirosController.delete)

export { excursaoPassageiros }

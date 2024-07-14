import { Router } from "express"
import { excursaoQuartosController } from "../controllers"

const excursaoQuartos = Router()

excursaoQuartos.get('/index', excursaoQuartosController.index)
excursaoQuartos.post('/create', excursaoQuartosController.create)
excursaoQuartos.get('/find/:idExcursao', excursaoQuartosController.find)
excursaoQuartos.put('/update/:idExcursao', excursaoQuartosController.update)
excursaoQuartos.delete('/delete/:id', excursaoQuartosController.delete)

export { excursaoQuartos }

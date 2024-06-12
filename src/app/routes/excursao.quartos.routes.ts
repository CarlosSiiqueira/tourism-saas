import { Router } from "express"
import { excursaoQuartosController } from "../controllers"

const excursaoQuartos = Router()

excursaoQuartos.post('/create', excursaoQuartosController.create)
excursaoQuartos.get('/find/:idExcursao', excursaoQuartosController.find)
excursaoQuartos.put('/update/:idExcursao', excursaoQuartosController.update)

export { excursaoQuartos }

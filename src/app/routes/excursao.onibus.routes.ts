import { Router } from "express"
import { excursaoOnibusController } from "../controllers"

const excursaoOnibus = Router()

excursaoOnibus.post('/create', excursaoOnibusController.create)
excursaoOnibus.get('/find/:idExcursao/:idCadeira', excursaoOnibusController.find)
excursaoOnibus.put('/update/:idExcursao', excursaoOnibusController.update)

export { excursaoOnibus }

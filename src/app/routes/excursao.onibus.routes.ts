import { Router } from "express"
import { excursaoOnibusController } from "../controllers"

const excursaoOnibus = Router()

excursaoOnibus.post('/create', excursaoOnibusController.create)
excursaoOnibus.get('/index/:idExcursao', excursaoOnibusController.index)
excursaoOnibus.get('/find/:idCadeira', excursaoOnibusController.find)
excursaoOnibus.get('/findAll/:idExcursao', excursaoOnibusController.findAll)
excursaoOnibus.put('/update/:id', excursaoOnibusController.update)

export { excursaoOnibus }

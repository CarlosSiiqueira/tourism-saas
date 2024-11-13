import { Router } from "express"
import { excursaoLocalEmbarqueController } from "../controllers"

const excursaoLocalEmbarque = Router()

excursaoLocalEmbarque.get('/index', excursaoLocalEmbarqueController.index)
excursaoLocalEmbarque.get('/find/:idExcursao', excursaoLocalEmbarqueController.find)
excursaoLocalEmbarque.get('/findAll', excursaoLocalEmbarqueController.findAll)
excursaoLocalEmbarque.post('/create', excursaoLocalEmbarqueController.create)
excursaoLocalEmbarque.put('/update/:id', excursaoLocalEmbarqueController.update)
excursaoLocalEmbarque.delete('/delete/:id', excursaoLocalEmbarqueController.delete)

export { excursaoLocalEmbarque }

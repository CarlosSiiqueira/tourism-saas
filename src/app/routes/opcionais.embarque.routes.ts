import { Router } from "express"
import { opcionaisEmbarqueController } from "../controllers"

const opcionalEmbarque = Router()

opcionalEmbarque.get('/index/:id/:idExcursao', opcionaisEmbarqueController.index)
opcionalEmbarque.post('/create', opcionaisEmbarqueController.create)
opcionalEmbarque.get('/find/:id', opcionaisEmbarqueController.find)
opcionalEmbarque.get('/findAll', opcionaisEmbarqueController.findAll)
opcionalEmbarque.put('/update/:id', opcionaisEmbarqueController.update)
opcionalEmbarque.delete('/delete/:id', opcionaisEmbarqueController.delete)

export { opcionalEmbarque }

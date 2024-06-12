import { Router } from "express"
import { destinosController } from "../controllers"

const destinos = Router()

destinos.post('/create', destinosController.create)
destinos.get('/find/:id', destinosController.find)
destinos.get('/findAll', destinosController.findAll)
destinos.put('/update/:id', destinosController.update)
destinos.patch('/delete/:id', destinosController.delete)

export { destinos }

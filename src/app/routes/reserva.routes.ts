import { Router } from "express"
import { reservaController } from "../controllers"

const reserva = Router()

reserva.get('/index', reservaController.index)
reserva.post('/create', reservaController.create)
reserva.get('/find/:id', reservaController.find)
reserva.get('/findAll', reservaController.findAll)
reserva.put('/update/:id', reservaController.update)
reserva.delete('/delete/:id', reservaController.delete)

export { reserva }

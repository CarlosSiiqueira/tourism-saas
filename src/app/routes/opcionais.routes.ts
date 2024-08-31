import { Router } from "express"
import { opcionaisController } from "../controllers"

const opcionais = Router()

opcionais.get('/index', opcionaisController.index)
opcionais.post('/create', opcionaisController.create)
opcionais.get('/find/:id', opcionaisController.find)
opcionais.get('/findAll', opcionaisController.findAll)
opcionais.put('/update/:id', opcionaisController.update)
opcionais.delete('/delete/:id', opcionaisController.delete)

export { opcionais }

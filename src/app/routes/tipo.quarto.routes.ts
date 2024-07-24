import { Router } from "express"
import { tipoQuartoController } from "../controllers"

const tipoQuarto = Router()


tipoQuarto.get('/find/:id', tipoQuartoController.find)
tipoQuarto.get('/findAll', tipoQuartoController.findAll)
tipoQuarto.post('/create', tipoQuartoController.create)
tipoQuarto.put('/update/:id', tipoQuartoController.update)
tipoQuarto.delete('/delete', tipoQuartoController.delete)

export { tipoQuarto }

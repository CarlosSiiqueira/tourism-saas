import { Router } from "express"
import { pacoteController } from "../controllers"

const pacote = Router()

pacote.get('/find/:id', pacoteController.find)
pacote.get('/findAll', pacoteController.findAll)
pacote.post('/create', pacoteController.create)
pacote.put('/update/:id', pacoteController.update)
pacote.patch('/delete', pacoteController.delete)

export { pacote }

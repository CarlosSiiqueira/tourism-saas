import { Router } from "express"
import { pacoteController } from "../controllers"

const pacote = Router()

pacote.get('/index', pacoteController.index)
pacote.get('/find/:id', pacoteController.find)
pacote.get('/findAll', pacoteController.findAll)
pacote.post('/create', pacoteController.create)
pacote.put('/update/:id', pacoteController.update)
pacote.patch('/delete/:id', pacoteController.delete)
pacote.get('/list-images-pacote/:search', pacoteController.listImagesPacote)

export { pacote }

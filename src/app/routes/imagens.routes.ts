import { Router } from "express"
import { imagensController } from "../controllers"

const imagens = Router()

imagens.get('/index', imagensController.index)
imagens.get('/find/:id', imagensController.find)
imagens.get('/findAll', imagensController.findAll)
imagens.post('/create', imagensController.create)
imagens.put('/update/:id', imagensController.update)
imagens.delete('/delete/:id', imagensController.delete)

export { imagens }

import { Router } from "express"
import { configuracoesController } from "../controllers"

const configuracao = Router()

configuracao.get('/index', configuracoesController.index)
configuracao.get('/find/:id', configuracoesController.find)
configuracao.get('/findAll', configuracoesController.findAll)
configuracao.post('/create', configuracoesController.create)
configuracao.put('/update/:id', configuracoesController.update)
configuracao.delete('/delete/:id', configuracoesController.delete)
configuracao.get('/findByType/:tipo', configuracoesController.findByType)

export { configuracao }

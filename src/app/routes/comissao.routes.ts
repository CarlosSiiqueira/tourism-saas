import { Router } from "express"
import { comissaoController } from "../controllers"

const comissao = Router()

comissao.get('/index', comissaoController.index)
comissao.get('/find/:id', comissaoController.find)
comissao.get('/findAll', comissaoController.findAll)
comissao.post('/create', comissaoController.create)
comissao.put('/update/:id', comissaoController.update)
comissao.delete('/delete/:id', comissaoController.delete)

export { comissao }

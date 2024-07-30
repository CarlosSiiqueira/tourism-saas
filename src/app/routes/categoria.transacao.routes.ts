import { Router } from "express"
import { categoriaTransacaoController } from "../controllers"

const categoriaTransacao = Router()

categoriaTransacao.get('/index', categoriaTransacaoController.index)
categoriaTransacao.get('/find/:id', categoriaTransacaoController.find)
categoriaTransacao.get('/findAll', categoriaTransacaoController.findAll)
categoriaTransacao.post('/create', categoriaTransacaoController.create)
categoriaTransacao.put('/update/:id', categoriaTransacaoController.update)
categoriaTransacao.delete('/delete/:id', categoriaTransacaoController.delete)

export { categoriaTransacao }

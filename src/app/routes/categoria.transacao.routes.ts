import { Router } from "express"
import { categoriaTransacaoController } from "../controllers"

const categoriaTransacao = Router()

categoriaTransacao.get('/find/:id', categoriaTransacaoController.find)
categoriaTransacao.get('/findAll', categoriaTransacaoController.findAll)
categoriaTransacao.post('/create', categoriaTransacaoController.create)
categoriaTransacao.put('/update/:id', categoriaTransacaoController.update)
categoriaTransacao.delete('/delete', categoriaTransacaoController.delete)

export { categoriaTransacao }

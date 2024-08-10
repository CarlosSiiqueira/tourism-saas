import { Router } from "express"
import { subCategoriaTransacaoController } from "../controllers"

const subCategoriaTransacao = Router()

subCategoriaTransacao.get('/index', subCategoriaTransacaoController.index)
subCategoriaTransacao.get('/find/:id', subCategoriaTransacaoController.find)
subCategoriaTransacao.get('/findAll', subCategoriaTransacaoController.findAll)
subCategoriaTransacao.post('/create', subCategoriaTransacaoController.create)
subCategoriaTransacao.put('/update/:id', subCategoriaTransacaoController.update)
subCategoriaTransacao.delete('/delete/:id', subCategoriaTransacaoController.delete)

export { subCategoriaTransacao }

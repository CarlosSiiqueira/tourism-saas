import { Router } from "express"
import { formaPagamentoController } from "../controllers"

const formaPagamento = Router()

formaPagamento.post('/create', formaPagamentoController.create)
formaPagamento.get('/find/:id', formaPagamentoController.find)
formaPagamento.get('/findAll', formaPagamentoController.findAll)
formaPagamento.put('/update/:id', formaPagamentoController.update)
formaPagamento.patch('/delete/:id', formaPagamentoController.delete)

export { formaPagamento }

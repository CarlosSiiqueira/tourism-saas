import { Router } from "express"
import { relatoriosController } from "../controllers"

const relatorios = Router()

relatorios.get('/clientes/:idCliente', relatoriosController.clientes)
relatorios.get('/categorias', relatoriosController.categorias)
relatorios.get('/excursoes', relatoriosController.excursoes)
relatorios.get('/fornecedor', relatoriosController.fornecedor)
relatorios.get('/pacotes', relatoriosController.pacotes)
relatorios.get('/vendas', relatoriosController.vendas)

export { relatorios }

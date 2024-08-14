import { Router } from "express"
import { relatoriosController } from "../controllers"

const relatorios = Router()

relatorios.get('/clientes', relatoriosController.clientes)

export { relatorios }

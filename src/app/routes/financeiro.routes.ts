import { Router } from "express"
import { financeiroController } from "../controllers"

const financeiro = Router()

financeiro.get('/index', financeiroController.index)
financeiro.post('/create', financeiroController.create)
financeiro.get('/find/:id', financeiroController.find)
financeiro.get('/findAll', financeiroController.findAll)
financeiro.put('/update/:id', financeiroController.update)
financeiro.patch('/delete/:id', financeiroController.delete)
financeiro.patch('/set-visto-admin/:id', financeiroController.setVistoAdmin)
financeiro.patch('/efetivar-transacao/:id', financeiroController.efetivarTransacao)
financeiro.patch('/des-efetivar/:id', financeiroController.desEfetivar)
financeiro.put('/clone/:id', financeiroController.clone)

export { financeiro }

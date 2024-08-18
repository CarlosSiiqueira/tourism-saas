import { Router } from "express"
import { rankingClientesController } from "../controllers"

const ranking = Router()

ranking.get('/index', rankingClientesController.index)
ranking.get('/find/:id', rankingClientesController.find)
ranking.get('/findAll', rankingClientesController.findAll)
ranking.post('/create', rankingClientesController.create)
ranking.put('/update/:id', rankingClientesController.update)
ranking.delete('/delete/:id', rankingClientesController.delete)

export { ranking }

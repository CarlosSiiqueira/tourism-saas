import { Router } from "express"
import { excursaoPassageirosController } from "../controllers"

const excursaoPassageiros = Router()

excursaoPassageiros.get('/index/:idExcursao', excursaoPassageirosController.index)
excursaoPassageiros.post('/create', excursaoPassageirosController.create)
excursaoPassageiros.get('/find/:idExcursao', excursaoPassageirosController.find)
excursaoPassageiros.get('/findAll', excursaoPassageirosController.findAll)
excursaoPassageiros.get('/list-passageiros/:idExcursao', excursaoPassageirosController.listPassageiros)
excursaoPassageiros.get('/list-passageiros-no-room/:idExcursao', excursaoPassageirosController.listPassageirosNoRoom)
excursaoPassageiros.delete('/delete/:idPassageiro/:idExcursao', excursaoPassageirosController.delete)
excursaoPassageiros.get('/list-passageiros-no-chair/:idExcursao', excursaoPassageirosController.listPassageirosNoChair)

export { excursaoPassageiros }

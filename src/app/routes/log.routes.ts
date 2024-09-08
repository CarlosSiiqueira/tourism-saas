import { Router } from "express"
import { logsController } from "../controllers"

const logs = Router()

logs.get('/index', logsController.index)
logs.get('/find/:id', logsController.find)
logs.get('/findAll', logsController.findAll)

export { logs }

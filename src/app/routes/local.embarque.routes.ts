import { Router } from "express"
import { localEmbarqueController } from "../controllers"

const localEmbarque = Router()

localEmbarque.get('/find/:id', localEmbarqueController.find)
localEmbarque.get('/findAll', localEmbarqueController.findAll)
localEmbarque.post('/create', localEmbarqueController.create)
localEmbarque.put('/update/:id', localEmbarqueController.update)
localEmbarque.patch('/delete', localEmbarqueController.delete)

export { localEmbarque }

import { Router } from "express"
import { pessoaController } from "../controllers"

const pessoa = Router()

pessoa.get('/index', pessoaController.index)
pessoa.get('/find/:id', pessoaController.find)
pessoa.get('/findAll', pessoaController.findAll)
pessoa.post('/create', pessoaController.create)
pessoa.put('/update/:id', pessoaController.update)
pessoa.patch('/delete/:id', pessoaController.delete)

export { pessoa }

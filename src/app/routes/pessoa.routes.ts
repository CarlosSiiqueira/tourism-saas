import { Router } from "express"
import { pessoaController } from "../controllers"

const pessoa = Router()

pessoa.get('/index', pessoaController.index)
pessoa.get('/find/:id', pessoaController.find)
pessoa.get('/findAll', pessoaController.findAll)
pessoa.get('/findByCpf/:cpf', pessoaController.findByCpf)
pessoa.post('/create', pessoaController.create)
pessoa.put('/update/:id', pessoaController.update)
pessoa.patch('/delete/:id', pessoaController.delete)
pessoa.get('/get-data-pessoa/:id', pessoaController.getDataPessoa)

export { pessoa }

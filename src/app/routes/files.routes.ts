import { Router } from "express"
import { filesController } from "../controllers"

const files = Router()

files.get('/csv-pessoas', filesController.generateCsvPessoas)
files.get('/csv-quartos/:idExcursao', filesController.generateCsvQuartos)
files.get('/csv-passageiros/:idExcursao', filesController.generateCsvPassageiros)

export { files }

import { Router } from "express"
import { filesController } from "../controllers"

const files = Router()

files.get('/csv-pessoas', filesController.generateCsvPessoas)

export { files }

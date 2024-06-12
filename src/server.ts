import "reflect-metadata"
const express = require('express')
import dotenv from 'dotenv'
import "../src/shared/container/index"
import { authenticateToken } from "./app/middlewares/authentication.middleware"
import { router } from "../src/app/routes"

dotenv.config();
const app = express()
const PORT = process.env.PORT

if (!process.env.JWT_SECRET_KEY) {
    console.error("JWT_SECRET is not defined in the environment variables")
    process.exit(1)
}

app.use(express.json())
app.use(authenticateToken)
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na url:http://localhost:${PORT}`)
})

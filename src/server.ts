import express from 'express'
import "reflect-metadata"
import "express-async-errors"
import "dotenv/config"
import "./shared/container"
import { authenticateToken } from "./app/middlewares/authentication.middleware"
import { router } from "../src/app/routes"
import { warning } from "./app/middlewares/error.middleware"
import cors from 'cors'
import { connectKafka, createDefaultMailTopic } from './shared/kafka'
import { processMailQueue } from './app/services/queue.consumer.service'

const app = express()
const PORT = process.env.PORT

if (!process.env.JWT_SECRET_KEY) {
  console.error("JWT_SECRET is not defined in the environment variables")
  process.exit(1)
}

app.use(cors({
  origin: [
    /http?:\/\/localhost:\d+/,
    'http://127.0.0.1:3000'
  ]
}))

app.use(express.json())
app.use(authenticateToken)
app.use(router)
app.use(warning)

const initializeKafka = async () => {
  try {
    await connectKafka();
    await createDefaultMailTopic();
  } catch (error) {
    console.error('Error initializing Kafka:', error);
    process.exit(1);
  }
};

initializeKafka().then(() => {
  processMailQueue().catch(console.error)
  app.listen(PORT, () => {
    console.log(`Servidor rodando na url:http://localhost:${PORT}`)
  })
})

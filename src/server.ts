import express from 'express'
import "reflect-metadata"
import "express-async-errors"
import "dotenv/config"
import "./shared/container"
import { authenticateToken } from "./app/middlewares/authentication.middleware"
import { warning } from "./app/middlewares/error.middleware"
import cors from 'cors'
import { connectKafka, createDefaultMailTopic } from './shared/kafka'
import { processMailQueue } from './app/services/queue.consumer.service'
import { router } from './app/routes'

const app = express()
const PORT = process.env.PORT

if (!process.env.JWT_SECRET_KEY) {
  console.error("JWT_SECRET is not defined in the environment variables")
  process.exit(1)
}

app.use(cors({
  origin: [
    /http?:\/\/localhost:\d+/,
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'https://reactjs-five-lovat.vercel.app',
    'https://prados-turismo-angular.vercel.app'
  ]
}))

app.use(express.json({ limit: "50mb" }))
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

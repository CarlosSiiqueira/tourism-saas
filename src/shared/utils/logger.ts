import crypto from "crypto"
import winston from "winston"
const { combine, timestamp, json } = winston.format

export interface Logger {
  transactionId?: string
  service?: string
  payload?: unknown
  cacheHit?: boolean
  operation?: string
  errorMessage?: string
  message?: string[]
  stack?: unknown
}

export const payloadLogger = {
  transactionId: crypto.randomUUID(),
  service: "API Gateway",
  payload: null,
  cacheHit: false,
  operation: null,
  code: 500,
  message: ["Ocorreu um erro desconhecido. Tente novamente mais tarde."],
  errorMessage: "Error 'unknown' in API Gateway",
  stack: null
}

export const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    json()
  ),
  transports: [new winston.transports.Console()]
})

import crypto from "crypto"
import { Request, Response, NextFunction } from "express"
import { Warning } from "../errors"
import { logger } from "../../shared/utils/logger"

const warning = (error: Error, _request: Request, response: Response, _next: NextFunction) => {

  const newLogger = {
    transactionId: crypto.randomUUID(),
    service: "API Record",
    payload: null,
    cacheHit: false,
    operation: null,
    code: 500,
    message: ["Ocorreu um erro desconhecido. Tente novamente mais tarde."],
    errorMessage: "Error 'unknown' in API Record",
    stack: null
  }

  if (error instanceof Warning) {
    Object.assign(newLogger, {
      code: error.code,
      message: error.message,
      ...error.logger
    })
  }

  if (error instanceof Error) {
    Object.assign(newLogger, {
      errorMessage: error.message,
      stack: error.stack
    })
  }


  if (newLogger.code >= 500 && newLogger.code < 600) {
    logger.error(newLogger)
  }

  if (error.name === "PrismaClientInitializationError") {
    Object.assign(newLogger, {
      message: ["Ops! Estamos com problemas técnicos. Tente novamente mais tarde ou contate nosso suporte."],
      errorMessage: error.message
    })
  }

  return response.status(newLogger.code).json({
    message: newLogger.message
  })
}

export { warning }
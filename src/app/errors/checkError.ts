import { Warning } from "."

export const checkError = ({ error, defaultMessage, defaultCode }: {
  error: unknown,
  defaultMessage: string,
  defaultCode: number
}) => {
  if (error instanceof Warning) {
    throw new Warning(error.message, error.code)
  }

  if (error instanceof Error && error.name === "PrismaClientInitializationError") {
    throw new Warning("Ops! Estamos com problemas técnicos. Tente novamente mais tarde ou contate nosso suporte.", 400)
  }

  throw new Warning(defaultMessage, defaultCode)
}

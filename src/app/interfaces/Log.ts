import { JsonValue } from "@prisma/client/runtime/library"
import { IIndex } from "./Helper"

export interface ILog {
  index(data: IIndex): Promise<{
    count: number
    rows: ILogResponse[]
  }>
  create(data: ILogDTO): Promise<string[]>
  find(id: string): Promise<ILogResponse>
  findAll(): Promise<ILogResponse[]>
  delete(id: string): Promise<string>
  update(data: ILogDTO, id: string): Promise<string[]>
}

export interface ILogDTO {
  tipo: string
  newData: JsonValue | null
  oldData: JsonValue | null
  usuariosId: string
}

export interface ILogResponse extends ILogDTO {
  id: string
}

import { inject, injectable } from "tsyringe";
import { LogRepository } from "../repositories/log.repository";
import { ILogDTO } from "../interfaces/Log";


@injectable()
export class LogService {

  constructor(
    @inject("LogRepository")
    private logRepository: LogRepository
  ) { }

  create = async ({
    tipo,
    newData,
    oldData,
    rotina,
    usuariosId }: ILogDTO): Promise<string[]> => {

    const log = await this.logRepository.create({
      tipo,
      newData,
      oldData,
      rotina,
      usuariosId
    })

    return log
  }

}
import { inject, injectable } from "tsyringe"
import { Warning } from "../errors"
import { IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"
import { PacoteRepository } from "../repositories/pacote.repository"

@injectable()
export class PacoteService {

  constructor (
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository
  ) { }


  getAllByIds = async (ids: Array<number>): Promise<IPacoteResponse[]> => {

    const pacotes = await this.pacoteRepository.getAllByIds(ids)

    return pacotes
  }

  find = async (id: string): Promise<IPacoteResponse> => {

    const pacote = await this.pacoteRepository.find(id)

    return pacote
  }

  setIdWP = async (id: string, idWP: number): Promise<string[]> => {

    const pacote = await this.pacoteRepository.setIdWP(id, idWP)

    return pacote
  }
}

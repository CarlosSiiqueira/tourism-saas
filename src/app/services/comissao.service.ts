import { injectable, inject } from "tsyringe";
import { ComissaoRepository } from "../repositories/comissao.repository";
import { IComissaoResponse } from "../interfaces/Comissao";

@injectable()
export class ComissaoService {

  constructor (
    @inject("ComissaoRepository")
    private comissaoRepository: ComissaoRepository
  ) { }


  findByFinanceiro = async (idFinanceiro: string): Promise<IComissaoResponse | null> => {

    const comissao = await this.comissaoRepository.findByFinanceiro(idFinanceiro)

    return comissao;
  }

  delete = async (id: string): Promise<IComissaoResponse> => {

    const comissao = await this.comissaoRepository.delete(id)

    return comissao;
  }

  setPaid = async (id: string, date: Date): Promise<string> => {
    return await this.comissaoRepository.setPaid(id, date)
  }

}
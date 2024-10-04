import { inject, injectable } from "tsyringe";
import { ConfiguracoesRepository } from "../repositories/configuracoes.repository";
import { IConfiguracaoResponse } from "../interfaces/Configuracoes";

@injectable()
export class ConfiguracaoService {

  constructor(
    @inject("ConfiguracoesRepository")
    private configuracoesRepository: ConfiguracoesRepository,
  ) { }

  findByType = async (tipo: string): Promise<IConfiguracaoResponse> => {

    const configuracao = await this.configuracoesRepository.findByType(tipo)

    return configuracao
  }
}

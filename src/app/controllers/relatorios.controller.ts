import { injectable, inject } from "tsyringe";
import { Request, Response } from 'express'
import { PessoaService } from "../services/pessoa.service";
import { formatIndexFilters } from "../../shared/utils/filters";

@injectable()
class RelatoriosController {

  constructor(
    private pessoaService: PessoaService
  ) { }

  clientes = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const report = await this.pessoaService.relatorioClientes({ orderBy, order, skip, take, filter })

    response.status(200).send(report)
  }

}

export { RelatoriosController }

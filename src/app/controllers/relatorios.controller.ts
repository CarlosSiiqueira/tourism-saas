import { injectable, inject } from "tsyringe";
import { Request, Response } from 'express'
import { formatIndexFilters } from "../../shared/utils/filters";
import { FinanceiroService } from "../services/financeiro.service";

@injectable()
class RelatoriosController {

  constructor(
    private financeiroService: FinanceiroService
  ) { }

  clientes = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroCliente({ orderBy, order, skip, take, filter }, request.params.idCliente)

    response.status(200).send(report)
  }

}

export { RelatoriosController }

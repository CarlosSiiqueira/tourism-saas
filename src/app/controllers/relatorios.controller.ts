import { injectable } from "tsyringe";
import { Request, Response } from 'express'
import { formatIndexFilters } from "../../shared/utils/filters";
import { FinanceiroService } from "../services/financeiro.service";

@injectable()
class RelatoriosController {

  constructor (
    private financeiroService: FinanceiroService
  ) { }

  clientes = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroCliente({ orderBy, order, skip, take, filter }, request.params.idCliente)

    response.status(200).send(report)
  }

  categorias = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroCategoria({ orderBy, order, skip, take, filter })

    response.status(200).send(report)
  }

  excursoes = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroExcursoes({ orderBy, order, skip, take, filter })

    response.status(200).send(report)
  }

  fornecedor = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroExcursoes({ orderBy, order, skip, take, filter })

    response.status(200).send(report)
  }

  pacotes = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroPacote({ orderBy, order, skip, take, filter })

    response.status(200).send(report)
  }

  vendas = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const report = await this.financeiroService.relatorioFinanceiroVenda({ orderBy, order, skip, take, filter })

    response.status(200).send(report)
  }

}

export { RelatoriosController }

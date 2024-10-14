import { injectable, inject } from "tsyringe";
import { ComissaoRepository } from "../repositories/comissao.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";
import { IFinanceiroDTO } from "../interfaces/Financeiro";
import { FinanceiroService } from "../services/financeiro.service";

@injectable()
class ComissaoController {

  constructor (
    @inject("ComissaoRepository")
    private comissaoRepository: ComissaoRepository,
    private logService: LogService,
    private financeiroService: FinanceiroService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.comissaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    let financeiro: IFinanceiroDTO = {
      ativo: true,
      tipo: 1,
      valor: request.body.valor,
      data: new Date(),
      codigoFormaPagamento: request.body.codigoFormaPagamento,
      usuarioCadastro: request.body.userId,
      codigoContaBancaria: request.body.codigoContaBancaria
    }

    const transacao = await this.financeiroService.create(financeiro)

    request.body.idTransacao = transacao
    const res = await this.comissaoRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Comissão',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.comissaoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.comissaoRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const configuracao = await this.comissaoRepository.find(request.params.id)
    const res = await this.comissaoRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, ...request.body }),
      oldData: JSON.stringify(configuracao),
      rotina: 'Comissão',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.comissaoRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Comissão',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }
}

export { ComissaoController }

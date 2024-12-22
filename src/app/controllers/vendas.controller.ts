import { injectable, inject } from "tsyringe";
import { VendasRepository } from "../repositories/vendas.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { FinanceiroService } from "../services/financeiro.service";
import { FormaPagamentoService } from "../services/forma.pagamento.service";
import { LogService } from "../services/log.service";
import { OpcionaisService } from "../services/opcionais.service";

@injectable()
class VendasController {

  constructor (
    @inject("VendasRepository")
    private vendasRepository: VendasRepository,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService,
    private logService: LogService,
    private opcionaisService: OpcionaisService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const res = await this.vendasRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.vendasRepository.create(request.body)

    const opcional = await this.opcionaisService.create({
      idReserva: request.body.reserva,
      idProduto: request.body.codigoProduto,
      qtd: request.body.qtd,
      codigoUsuario: user.id
    })

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Vendas',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.vendasRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const venda = await this.vendasRepository.find(request.params.id)
    const res = await this.vendasRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(res),
      oldData: JSON.stringify(venda),
      rotina: 'Vendas',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.vendasRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Vendas',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }

  efetivar = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const venda = await this.vendasRepository.efetivar(request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(venda),
      oldData: null,
      rotina: 'Vendas/Efetivar',
      usuariosId: user.id
    })

    if (venda) {
      const formaPagamento = await this.formaPagamentoService.find(venda.codigoFormaPagamento)

      const res = await this.financeiroService.create({
        tipo: 2,
        observacao: 'venda efetivada',
        ativo: true,
        data: await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento),
        usuarioCadastro: venda.usuarioCadastro,
        valor: venda.valorTotal,
        codigoExcursao: venda.codigoExcursao,
        codigoProduto: venda.codigoProduto,
        codigoFormaPagamento: formaPagamento.id,
        numeroComprovanteBancario: venda.numeroComprovante
      });

      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: res, ...request.body }),
        oldData: null,
        rotina: 'Vendas/Efetivar/Financeiro',
        usuariosId: user.id
      })
    }

    response.status(200).send(venda)
  }

  desEfetivar = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const venda = await this.vendasRepository.desEfetivar(request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(venda),
      oldData: null,
      rotina: 'Vendas/Desefetivar',
      usuariosId: user.id
    })

    response.status(200).send(venda)
  }


}

export { VendasController }
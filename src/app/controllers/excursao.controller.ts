import { ExcursaoRepository } from '../repositories/excursao.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteService } from '../services/pacote.service'
import { FinanceiroService } from '../services/financeiro.service'
import { dateValidate } from '../../shared/helper/date'
import { LogService } from '../services/log.service'
import { RankingClientesService } from '../services/ranking.clientes.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'
import { PessoaService } from '../services/pessoa.service'

@injectable()
class ExcursaoController {

  constructor (
    @inject("ExcursaoRepository")
    private excursaoRepository: ExcursaoRepository,
    private pacoteService: PacoteService,
    private financeiroService: FinanceiroService,
    private logService: LogService,
    private rankingClientesService: RankingClientesService,
    private excursaoPassageiroService: ExcursaoPassageiroService,
    private pessoaService: PessoaService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.excursaoRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const excursao = await this.excursaoRepository.create(request.body)

    const result = await Promise.all(
      request.body.itensAdicionais.map(async (item: { data: string, valor: number, codigoFormaPagamento: string, idFornecedor: string }) => {

        request.body.tipo = 1
        request.body.ativo = true
        request.body.data = dateValidate(item.data)
        request.body.usuarioCadastro = request.body.usuarioCadastro
        request.body.valor = item.valor
        request.body.codigoExcursao = excursao
        request.body.codigoFormaPagamento = item.codigoFormaPagamento
        request.body.codigoFornecedor = item.idFornecedor

        await this.financeiroService.create(request.body)
      })
    )

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: excursao, ...request.body }),
      oldData: null,
      rotina: 'Excursões',
      usuariosId: user.id
    })

    response.status(200).send(excursao)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.excursaoRepository.findAll()

    response.status(200).send(res)

  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.excursaoRepository.delete(request.params.id)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: JSON.stringify({ id: request.params.id }),
        oldData: null,
        rotina: 'Excursões',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)

  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const oldExcrusao = await this.excursaoRepository.find(request.params.id)
    const excursao = await this.excursaoRepository.update(request.body, request.params.id)

    if (excursao) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: request.params.id, ...request.body }),
        oldData: JSON.stringify(oldExcrusao),
        rotina: 'Excursões',
        usuariosId: user.id
      })
    }

    response.status(200).send(excursao)
  }

  publish = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const excursao = await this.excursaoRepository.publish(request.params.id)

    if (excursao.id) {

      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify(excursao),
        oldData: null,
        rotina: 'Excursões/Publicar',
        usuariosId: user.id
      })
    }

    response.status(200).send('Excursão publicada com sucesso')
  }

  concluir = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);
    const id = request.params.id

    const excursao = await this.excursaoRepository.concluir(id)

    const passageiros = await this.excursaoPassageiroService.find(id)

    await Promise.all(
      passageiros.map(async (passageiro) => {
        let totalTrips = await this.excursaoPassageiroService.countTripsByPassenger(passageiro.Pessoa.id)
        let rankUp = await this.rankingClientesService.rankUp(totalTrips, passageiro.Pessoa.rankingClientesId || '')

        if (rankUp.rankUp) {
          await this.pessoaService.updateRank(passageiro.Pessoa.id, rankUp.rank?.id || '')
        }
      })
    )

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(excursao),
      oldData: null,
      rotina: 'Excursões/Concluir',
      usuariosId: user.id
    })

    response.status(200).send('Excursão concluída com sucesso')
  }
}

export { ExcursaoController }

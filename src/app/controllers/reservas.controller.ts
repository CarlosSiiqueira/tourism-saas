import { ReservaRepository } from '../repositories/reserva.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { formatIndexFilters } from '../../shared/utils/filters'
import { FinanceiroService } from '../services/financeiro.service'
import { FormaPagamentoService } from '../services/forma.pagamento.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'
import { CreditoClienteService } from '../services/credito.cliente.service'
import { OpcionaisService } from '../services/opcionais.service'
import { LogService } from '../services/log.service'
import { ExcursaoQuartosService } from '../services/excursao.quarto.service'
import { ExcursaoOnibusService } from '../services/excursao.onibus.service'
import { PdfService } from '../services/pdf.service'
import { htmlEmailReserva, htmlTicket } from '../../shared/helper/html'
import { EmailService } from '../services/mail.service'
import { formattingDate } from '../../shared/helper/date'

@injectable()
class ReservaController {
  constructor (
    @inject("ReservaRepository")
    private reservaRepository: ReservaRepository,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService,
    private excursaoPassageiroService: ExcursaoPassageiroService,
    private creditoClienteService: CreditoClienteService,
    private opcionaisService: OpcionaisService,
    private logService: LogService,
    private excursaoQuartosService: ExcursaoQuartosService,
    private excursaoOnibusService: ExcursaoOnibusService,
    private pdfService: PdfService,
    private emailService: EmailService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.reservaRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const passageiro = await this.excursaoPassageiroService.findByIdPessoa(request.body.passageiros, request.body.idExcursao)
    let resp = 'Esse Passageiro já está nessa excursão'
    let user = JSON.parse(request.headers.user as string);

    if (!passageiro.length) {
      let observacoes = ''
      const reserva = await this.reservaRepository.create(request.body)
      const formaPagamento = await this.formaPagamentoService.find(request.body.codigoFormaPagamento)

      if (request.body.opcionais.length) {
        observacoes += "Opcionais: \n"
        const opcionais = await Promise.all(
          request.body.opcionais.map(async (opt: { id: string, quantidade: number, valor: number, nome: string }) => {
            if (opt.quantidade) {
              observacoes += `${opt.quantidade}x ${opt.nome} \n`
              return await this.opcionaisService.create({
                idReserva: reserva,
                idProduto: opt.id,
                codigoUsuario: request.body.codigoUsuario,
                qtd: opt.quantidade
              })
            }
          })
        )
      }

      await this.logService.create({
        tipo: 'CREATE',
        newData: JSON.stringify(await this.reservaRepository.find(reserva)),
        oldData: null,
        rotina: 'Reservas',
        usuariosId: user.id
      })

      request.body.idReserva = reserva || ''
      request.body.tipo = 2
      observacoes += request.body.criancasColo > 0 ? `${request.body.criancasColo}x crianças de colo nessa Reserva \n` : ''
      request.body.observacao = observacoes
      request.body.ativo = true
      request.body.data = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)
      request.body.usuarioCadastro = request.body.codigoUsuario
      request.body.valor = request.body.total
      request.body.codigoExcursao = request.body.idExcursao

      const financeiro = await this.financeiroService.create(request.body)

      await this.logService.create({
        tipo: 'CREATE',
        newData: JSON.stringify(await this.financeiroService.find(financeiro)),
        oldData: null,
        rotina: 'Reservas/Financeiro',
        usuariosId: user.id
      })

      await Promise.all(
        request.body.passageiros.map(async (passageiro: string) => {
          return await this.excursaoPassageiroService.create({
            idExcursao: request.body.idExcursao,
            idPassageiro: passageiro,
            localEmbarque: request.body.localEmbarqueId,
            reserva: reserva
          })
        })
      )

      resp = 'Reserva criada com sucesso'
    }
    response.status(200).send(resp)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.reservaRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.reservaRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const reserva = await this.reservaRepository.find(request.params.id)

    const idPassageiros = reserva.Pessoa.map((passageiro) => {
      return passageiro.id
    })

    await this.excursaoQuartosService.deleteManyByIdPassageiro(idPassageiros, reserva.Excursao.id)
    await this.excursaoOnibusService.deleteManyByIdPassageiro(idPassageiros, reserva.Excursao.id)
    await this.excursaoPassageiroService.deleteMultiple(idPassageiros, reserva.Excursao.id)
    const res = await this.reservaRepository.delete(request.params.id)

    await this.logService.create({
      tipo: 'DELETE',
      newData: null,
      oldData: JSON.stringify(reserva),
      rotina: 'Reservas',
      usuariosId: user.id
    })

    if (reserva.Transacoes?.length) {
      await Promise.all(
        reserva.Transacoes.map(async (reserva) => {
          return await this.financeiroService.delete(reserva.id);
        })
      )
    }

    response.status(200).send(res)
  }

  cancelar = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const reserva = await this.reservaRepository.find(request.params.id)

    const idPassageiros = reserva.Pessoa.map((passageiro) => {
      return passageiro.id
    })

    await this.excursaoQuartosService.deleteManyByIdPassageiro(idPassageiros, reserva.Excursao.id)
    await this.excursaoOnibusService.deleteManyByIdPassageiro(idPassageiros, reserva.Excursao.id)
    await this.excursaoPassageiroService.deleteMultiple(idPassageiros, reserva.Excursao.id)
    const res = await this.reservaRepository.delete(request.params.id)

    await this.logService.create({
      tipo: 'DELETE',
      newData: null,
      oldData: JSON.stringify(reserva),
      rotina: 'Reservas/Cancelar',
      usuariosId: user.id
    })

    if (reserva.status) {
      await Promise.all(
        reserva.Pessoa.map(async (person) => {
          return await this.creditoClienteService.create({
            valor: request.body.valor / reserva.Pessoa.length,
            pessoasId: person.id,
            idReserva: reserva.id,
            usuariosId: request.body.codigoUsuario
          })
        })
      )
    }

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let observacoes = ''
    let user = JSON.parse(request.headers.user as string);

    const currentReserva = await this.reservaRepository.find(request.params.id)
    const financeiro = await this.financeiroService.find(request.body.Transacoes[0].id)
    await this.excursaoPassageiroService.deleteMultiple(request.body.passageiros, request.body.idExcursao)
    const reserva = await this.reservaRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, ...request.body }),
      oldData: JSON.stringify(currentReserva),
      rotina: 'Reservas',
      usuariosId: user.id
    })

    await Promise.all(
      request.body.passageiros.map(async (passageiro: string) => {
        return await this.excursaoPassageiroService.create({
          idExcursao: request.body.idExcursao,
          idPassageiro: passageiro,
          localEmbarque: request.body.localEmbarqueId,
          reserva: request.params.id
        })
      })
    )

    if (request.body.opcionais.length) {
      observacoes += "Opcionais: \n"
      await this.opcionaisService.deleteByReservaId(request.params.id)

      const opcionais = await Promise.all(
        request.body.opcionais.map(async (opt: { id: string, quantidade: number, valor: number, nome: string }) => {
          if (opt.quantidade) {
            observacoes += `${opt.quantidade}x ${opt.nome} \n`
            return await this.opcionaisService.create({
              idReserva: request.params.id,
              idProduto: opt.id,
              codigoUsuario: request.body.codigoUsuario,
              qtd: opt.quantidade
            })
          }
        })
      )
    }

    if (financeiro) {
      const formaPagamento = await this.formaPagamentoService.find(request.body.codigoFormaPagamento)

      financeiro.data = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)
      financeiro.valor = request.body.total
      observacoes += request.body.criancasColo > 0 ? `${request.body.criancasColo}x nessa Reserva` : ''
      financeiro.observacao = observacoes
      await this.financeiroService.update(financeiro, financeiro.id)
    }

    response.status(200).send(reserva)
  }

  sendTicketMail = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);
    const reserva = await this.reservaRepository.find(request.params.id)
    let excursaoNome = `${reserva.Excursao.nome} - ${formattingDate(reserva.Excursao.dataInicio.toDateString())} à ${formattingDate(reserva.Excursao.dataFim.toDateString())}`

    const html = await htmlTicket(reserva);
    const pdf = await this.pdfService.generatePdf(html)

    reserva.Pessoa.map(async (passageiro) => {

      let htmlEmail = await htmlEmailReserva(reserva, passageiro)

      this.emailService.sendEmail('carlooos.siqueira@gmail.com',
        excursaoNome,
        htmlEmail,
        3,
        [
          {
            filename: 'voucher.pdf',
            content: pdf,
            contentType: 'application/pdf'

          }
        ])
    })

    await this.logService.create({
      tipo: 'CREATE',
      newData: null,
      oldData: null,
      rotina: 'Reservas/Envio de email-voucher',
      usuariosId: user.id
    })

    response.send('Email enviado').status(200)
  }
}

export { ReservaController }

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
import { htmlEmailCredito, htmlEmailReserva, htmlTicket } from '../../shared/helper/html'
import { EmailService } from '../services/mail.service'
import { formattingDate } from '../../shared/helper/date'
import { IPagarmeLinkDTO } from '../interfaces/Helper'
import { PessoaService } from '../services/pessoa.service'
import { ExcursaoService } from '../services/excursao.service'
import { Warning } from '../errors'

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
    private emailService: EmailService,
    private pessoaService: PessoaService,
    private excursaoService: ExcursaoService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.reservaRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const passageiro = await this.excursaoPassageiroService.findByIdPessoa(request.body.passageiros, request.body.idExcursao)
    let resp = ''
    let user = JSON.parse(request.headers.user as string);
    const { opcionais } = request.body
    const { passageiros } = request.body
    const { idExcursao } = request.body
    const excursao = await this.excursaoService.find(idExcursao)
    const vagas = excursao.vagas

    if (passageiro.length || vagas < passageiros.length) {
      resp += passageiro.length ? 'Passageiro já está na excursão' : ''
      resp += vagas < passageiros.length ? '\n Excursão Lotada!' : ''
      throw new Warning(resp, 409)
    }

    let observacoes = ''
    const reserva = await this.reservaRepository.create(request.body)
    const formaPagamento = await this.formaPagamentoService.find(request.body.codigoFormaPagamento)

    if (opcionais.length) {
      observacoes += "Opcionais: \n"
      await Promise.all(
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

    const dataFinanceiro = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    const financeiro = await this.financeiroService.create({
      idReserva: reserva || '',
      tipo: 2,
      observacao: observacoes,
      ativo: true,
      data: dataFinanceiro,
      usuarioCadastro: request.body.codigoUsuario,
      valor: request.body.total,
      codigoExcursao: idExcursao,
      codigoFormaPagamento: formaPagamento.id,
      codigoContaBancaria: request.body?.codigoContaBancaria
    })

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify(await this.financeiroService.find(financeiro)),
      oldData: null,
      rotina: 'Reservas/Financeiro',
      usuariosId: user.id
    })

    await Promise.all(
      passageiros.map(async (passageiro: string) => {
        return await this.excursaoPassageiroService.create({
          idExcursao: idExcursao,
          idPassageiro: passageiro,
          localEmbarque: request.body.localEmbarqueId,
          reserva: reserva
        })
      })
    )

    if (request.body.passengerLink) {

      let opcionaisReserva
      let dataLink: IPagarmeLinkDTO = {
        opcionais: [],
        paymentMethods: ['credit_card', 'pix'],
        quantidade: passageiros.length
      }

      const customer = await this.pessoaService.find(request.body.passengerLink)

      if (opcionais.length) {

        opcionaisReserva = await this.opcionaisService.findByReserva(reserva)

        dataLink.opcionais = opcionaisReserva.map((opt) => {
          return {
            nome: opt.Produto.nome,
            valor: opt.Produto.valor,
            quantidade: opt.qtd
          }
        })
      }

      try {

        const data = await this.financeiroService.generatePaymentLink(dataLink, customer, excursao)
        await this.reservaRepository.updatePaymentLinkId(reserva, data.id)

        await this.emailService.sendEmail(customer.email, 'Link de pagamento Prados Turismo', '', 3)

      } catch (error) {
        throw new Warning('Ocorreu um erro ao gerar link de pagamento', 404)
      }
    }

    response.status(200).send('Reserva criada com sucesso')
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

          let valor = request.body.valor / reserva.Pessoa.length

          await this.creditoClienteService.create({
            valor,
            pessoasId: person.id,
            idReserva: reserva.id,
            usuariosId: request.body.codigoUsuario
          })

          let textEmail = htmlEmailCredito(`#${reserva.reserva}`, person.nome, valor)

          await this.emailService.sendEmail(
            person.email,
            "Prados Turismo - Geramos um crédito pra você",
            textEmail,
            3
          )

        })
      )
    }

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let observacoes = ''
    let user = JSON.parse(request.headers.user as string);
    const { opcionais } = request.body
    const { passageiros } = request.body
    const { idExcursao } = request.body
    const { id } = request.params
    const excursao = await this.excursaoService.find(idExcursao)

    if (excursao.vagas < passageiros.length) {
      throw new Warning('Excursão lotada', 409)
    }

    const currentReserva = await this.reservaRepository.find(id)
    const financeiro = await this.financeiroService.find(request.body.Transacoes[0].id)
    await this.excursaoPassageiroService.deleteMultiple(passageiros, idExcursao)
    const reserva = await this.reservaRepository.update(request.body, id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: id, ...request.body }),
      oldData: JSON.stringify(currentReserva),
      rotina: 'Reservas',
      usuariosId: user.id
    })

    await Promise.all(
      passageiros.map(async (passageiro: string) => {
        return await this.excursaoPassageiroService.create({
          idExcursao: idExcursao,
          idPassageiro: passageiro,
          localEmbarque: request.body.localEmbarqueId,
          reserva: id
        })
      })
    )

    if (opcionais.length) {
      observacoes += "Opcionais: \n"
      await this.opcionaisService.deleteByReservaId(id)

      await Promise.all(
        opcionais.map(async (opt: { id: string, quantidade: number, valor: number, nome: string }) => {
          if (opt.quantidade) {
            observacoes += `${opt.quantidade}x ${opt.nome} \n`
            return await this.opcionaisService.create({
              idReserva: id,
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

    if (request.body.passengerLink) {

      let opcionaisReserva
      let dataLink: IPagarmeLinkDTO = {
        opcionais: [],
        paymentMethods: ['credit_card', 'pix'],
        quantidade: passageiros.length
      }

      const customer = await this.pessoaService.find(request.body.passengerLink)

      if (opcionais.length) {

        opcionaisReserva = await this.opcionaisService.findByReserva(request.params.id)

        dataLink.opcionais = opcionaisReserva.map((opt) => {
          return {
            nome: opt.Produto.nome,
            valor: opt.Produto.valor,
            quantidade: opt.qtd
          }
        })
      }

      try {

        const data = await this.financeiroService.generatePaymentLink(dataLink, customer, excursao)
        await this.reservaRepository.updatePaymentLinkId(id, data.id)

        await this.emailService.sendEmail(customer.email, 'Link de pagamento Prados Turismo', '', 3)

      } catch (error) {
        response.status(200).send(`${error} \n Ocorreu um erro ao gerar link de pagamento.`)
      }
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

  efetivaReserva = async (request: Request, response: Response): Promise<void> => {

    const { data } = request.body

    const reserva = await this.reservaRepository.findByPaymentLinkId(data.id)

    if (reserva) {
      await this.reservaRepository.setConfirm(reserva.id, true)
    }

    response.send(reserva).status(200)
  }

  downloadVoucherReserva = async (request: Request, response: Response): Promise<void> => {

    response.setHeader('Content-Disposition', 'attachment; filename=data.pdf');
    response.setHeader('Content-Type', 'application/pdf');

    const reserva = await this.reservaRepository.find(request.params.id)
    const html = await htmlTicket(reserva);
    const pdf = await this.pdfService.generatePdf(html)

    response.send(pdf).status(200)
  }
}

export { ReservaController }

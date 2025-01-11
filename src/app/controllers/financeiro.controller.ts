import { FinanceiroRepository } from '../repositories/financeiro.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { FinanceiroService } from '../services/financeiro.service'
import { formatIndexFilters } from '../../shared/utils/filters'
import { FormaPagamentoService } from '../services/forma.pagamento.service'
import { PacoteService } from '../services/pacote.service'
import { ReservaService } from '../services/reserva.service'
import { EnderecoService } from '../services/endereco.service'
import { PessoaService } from '../services/pessoa.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'
import { ContaBancariaService } from '../services/conta.bancaria.service'
import { LogService } from '../services/log.service'
import { ComissaoService } from '../services/comissao.service'
import { IPessoaReservaDTO } from '../interfaces/Pessoa'
import { ConfiguracaoService } from '../services/configuracoes.service'
import { pagarme } from '../api/pagarme'
import { OpcionalReserva, PagarmeLinkItem, PagarmeLinkRequestBody } from '../interfaces/Helper'
import { ExcursaoService } from '../services/excursao.service'
import { formattingDate } from '../../shared/helper/date'
import { OpcionaisService } from '../services/opcionais.service'

@injectable()
class FinanceiroController {
  constructor (
    @inject("FinanceiroRepository")
    private financeiroRepository: FinanceiroRepository,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService,
    private reservaService: ReservaService,
    private pessoaService: PessoaService,
    private excursaoPassageiroService: ExcursaoPassageiroService,
    private contaBancariaService: ContaBancariaService,
    private logService: LogService,
    private comissaoService: ComissaoService,
    private configService: ConfiguracaoService,
    private excursaoService: ExcursaoService,
    private opcionaisService: OpcionaisService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const res = await this.financeiroRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const formaPagamento = await this.formaPagamentoService.find(request.body.codigoFormaPagamento)

    if (request.body.tipo == 2) {
      request.body.data = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)
    }

    request.body.valor = request.body.tipo == 2 ? await this.formaPagamentoService.calculateTaxes(request.body.valor, formaPagamento.id, 1) : request.body.valor

    const res = await this.financeiroRepository.create(request.body)

    if (res && request.body.efetivado) {
      let tipoMovimentacao = request.body.tipo == 2 ? "C" : "D"
      await this.contaBancariaService.movimentar(request.body.codigoContaBancaria, request.body.valor, tipoMovimentacao)
    }

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Financeiro',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  shopping = async (request: Request, response: Response): Promise<void> => {

    const excursaoId: string = request.body.excursaoId
    const criancas: number = request.body.criancas
    let dataCliente: IPessoaReservaDTO[] = request.body.clients
    const localEmbarque = dataCliente[0].localEmbarque
    let clients: { codigoCliente: string, localEmbarque: string }[];
    const { opcionais } = request.body

    const config = (await this.configService.findByType('default-user')).configuracao
    const paymentConfig = (await this.configService.findByType('default-forma-pagamento')).configuracao
    let defaultUser = config ? JSON.parse(config.toString()).id : '1'
    let defaultPayment = paymentConfig ? JSON.parse(paymentConfig.toString()).id : null

    if (!defaultPayment) {
      response.send('Configure uma forma de pagamentro padrão antes de utilizar o sistema').status(404)
    }

    if (!defaultUser) {
      response.send('Configure uma usuário padrão antes de utilizar o sistema').status(404)
    }

    const formaPagamento = await this.formaPagamentoService.find(defaultPayment)
    const dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    clients = await Promise.all(
      dataCliente.map(async (customer) => {

        const pessoa = await this.pessoaService.findByCpf(customer.cpf)
        let codigoCliente = pessoa?.id || ''

        if (!pessoa) {

          const cliente = await this.pessoaService.create({
            nome: `${customer.nome}`,
            cpf: customer.cpf,
            sexo: customer.sexo,
            email: customer.email,
            telefone: customer.telefone,
            dataNascimento: customer.dataNascimento || null,
            observacoes: 'cadastrado via compra no site',
            telefoneWpp: null,
            contato: null,
            telefoneContato: null,
            usuarioCadastro: defaultUser,
            rg: customer.rg,
            emissor: customer.emissor || null
          }, null)

          codigoCliente = cliente
        }

        return { codigoCliente, localEmbarque: customer.localEmbarque }
      })

    )

    if (clients.length) {
      let observacoes = ''

      const reserva = await this.reservaService.create({
        idExcursao: excursaoId,
        passageiros: clients.map((customer) => { return customer.codigoCliente }),
        codigoUsuario: defaultUser,
        desconto: 0,
        localEmbarqueId: localEmbarque,
        criancasColo: criancas
      })

      await Promise.all(
        clients.map(async (customer) => {
          const passageiro = await this.excursaoPassageiroService.create({
            idExcursao: excursaoId,
            idPassageiro: customer.codigoCliente,
            localEmbarque: customer.localEmbarque,
            reserva: reserva
          })
        }))

      if (opcionais.length) {
        observacoes += "Opcionais: \n"
        await Promise.all(
          opcionais.map(async (opt: { id: string, quantidade: number, valor: number, nome: string }) => {
            if (opt.quantidade) {
              observacoes += `${opt.quantidade}x ${opt.nome} \n`
              return await this.opcionaisService.create({
                idReserva: reserva,
                idProduto: opt.id,
                codigoUsuario: defaultUser,
                qtd: opt.quantidade
              })
            }
          })
        )
      }

      await this.financeiroRepository.create({
        tipo: 2,
        valor: parseFloat(request.body.total),
        vistoAdmin: false,
        efetivado: false,
        observacao: observacoes,
        ativo: true,
        idReserva: reserva,
        codigoExcursao: excursaoId,
        data: dataPrevistaRecebimento,
        usuarioCadastro: defaultUser,
        codigoFormaPagamento: formaPagamento.id
      })
    }

    response.status(201).send('reserva registrada com sucesso')
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const formaPagamento = await this.formaPagamentoService.find(request.body.codigoFormaPagamento)

    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    request.body.valor = request.body.tipo == 2 ? await this.formaPagamentoService.calculateTaxes(request.body.valor, formaPagamento.id, 1) : request.body.valor

    const financeiro = await this.financeiroRepository.find(request.params.id)
    const res = await this.financeiroRepository.update(request.body, request.params.id)

    if (res && request.body.efetivado) {
      let tipoMovimentacao = request.body.tipo == 2 ? "C" : "D"
      await this.contaBancariaService.movimentar(request.body.codigoContaBancaria, request.body.valor, tipoMovimentacao)

      if (request.body.idReserva) {
        await this.reservaService.confirmaReserva(request.body.idReserva)
      }
    }

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: JSON.stringify(financeiro),
      rotina: 'Financeiro',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const financeiro = await this.financeiroRepository.find(request.params.id)

    if (financeiro && financeiro.efetivado) {
      let tipoMovimentacao = financeiro.tipo == 2 ? "D" : "C"
      await this.contaBancariaService.movimentar(financeiro.codigoContaBancaria || '', financeiro.valor, tipoMovimentacao)
    }

    let comissao = await this.comissaoService.findByFinanceiro(request.params.id)

    if (comissao) {
      await this.comissaoService.delete(comissao.id)
    }

    const res = await this.financeiroRepository.delete(request.params.id)

    await this.logService.create({
      tipo: 'DELETE',
      newData: null,
      oldData: JSON.stringify(financeiro),
      rotina: 'Financeiro',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  setVistoAdmin = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.financeiroRepository.setVistoAdmin(request.body.visto, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, user: `Usuário ${user.nome} marcou como visto` }),
      oldData: null,
      rotina: 'Financeiro/SetVistoAdmin',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  efetivarTransacao = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);
    let res: string = ''
    const efetivar = await this.financeiroService.efetivarTransacao(request.params.id)
    const financeiro = await this.financeiroRepository.find(request.params.id)

    if (financeiro && efetivar) {
      let tipoMovimentacao: string = financeiro.tipo == 2 ? "C" : "D"
      res = await this.contaBancariaService.movimentar(financeiro.codigoContaBancaria || '', financeiro.valor, tipoMovimentacao)
    }

    if (financeiro?.idReserva) {
      await this.reservaService.confirmaReserva(financeiro.idReserva)
    }

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(financeiro),
      oldData: null,
      rotina: 'Financeiro/Efetivar',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  desEfetivar = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);
    let res: string = ''
    const desefetivar = await this.financeiroService.desEfetivar(request.params.id)
    const financeiro = await this.financeiroRepository.find(request.params.id)

    if (financeiro && desefetivar) {
      let tipoMovimentacao: string = financeiro.tipo == 2 ? "D" : "C"
      res = await this.contaBancariaService.movimentar(financeiro.codigoContaBancaria || '', financeiro.valor, tipoMovimentacao)
    }

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify(financeiro),
      oldData: null,
      rotina: 'Financeiro/Desefetivar',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  clone = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const clonedTransaction = await this.financeiroRepository.find(request.params.id)

    if (clonedTransaction) {
      const id = await this.financeiroRepository.create(clonedTransaction)
      let tipoMovimentacao: string = clonedTransaction.tipo == 2 ? "D" : "C"

      await this.contaBancariaService.movimentar(clonedTransaction.codigoContaBancaria || '', clonedTransaction.valor, tipoMovimentacao)

      await this.logService.create({
        tipo: 'CREATE',
        newData: JSON.stringify({ id: request.params.id, transacaoClonada: clonedTransaction }),
        oldData: null,
        rotina: 'Financeiro/Clonar',
        usuariosId: user.id
      })

      response.status(200).send(id)
      return
    }

    response.status(301).send('Não foi possivel realizar procedimento')
  }

  generatePaymentLink = async (request: Request, response: Response): Promise<void> => {

    const { opcionais } = request.body
    const { cliente } = request.body
    const { idExcursao } = request.body
    const paymentMethod: Array<string> = request.body.paymentMethods

    const customer = await this.pessoaService.find(cliente)
    const excursao = await this.excursaoService.find(idExcursao)
    const phones = {}
    const pixSettings = { expires_in: 2 }
    const installmentsAmount = excursao.valor >= 2000 ? 10 : 5
    const quantidadeExcursao = request.body.quantidade
    const country_code = "55"
    const valorTotalExcursao = excursao.valor

    var area_code;
    var number;
    var area_code_mobile;
    var number_mobile;
    var opcionaisItems;
    var valorTotalOpcionais = 0

    if (customer.telefone) {
      area_code = customer.telefone?.slice(0, 2) || '85'
      number = customer?.telefone?.slice(2) || ''
    }

    if (customer.telefoneWpp) {
      area_code_mobile = customer.telefoneWpp?.slice(0, 2) || '85'
      number_mobile = customer?.telefoneWpp?.slice(2) || ''
    }

    if (opcionais.length) {
      opcionaisItems = opcionais.map((opcional: OpcionalReserva) => {
        if (opcional.quantidade) {
          return {
            amount: Math.round(opcional.valor * 100),
            name: opcional.nome,
            default_quantity: opcional.quantidade,
            description: ''
          }
        }
      })

      opcionaisItems = opcionaisItems.filter((item: PagarmeLinkItem) => !!item)

      valorTotalOpcionais = opcionaisItems.reduce((value: number, opcional: PagarmeLinkItem) => value + (opcional.amount * opcional.default_quantity), 0)
    }

    const requestLink: PagarmeLinkRequestBody = {
      is_building: false,
      payment_settings: {
        credit_card_settings: {
          operation_type: "auth_and_capture",
          installments: Array.from({ length: installmentsAmount }, (_, index) => ({
            number: index + 1,
            total: Math.round((valorTotalExcursao * quantidadeExcursao) * 100) + valorTotalOpcionais,
          })),
        },
        accepted_payment_methods: paymentMethod
      },
      cart_settings: {
        items: [
          {
            amount: Math.round(valorTotalExcursao * 100),
            name: `${formattingDate(excursao.dataInicio.toDateString())} à ${formattingDate(excursao.dataFim.toDateString())} - ${excursao.nome}`,
            description: "",
            default_quantity: quantidadeExcursao
          }
        ]
      },
      name: `${formattingDate(excursao.dataInicio.toDateString())} à ${formattingDate(excursao.dataFim.toDateString())} - ${excursao.nome}`,
      type: "order",
      customer_settings: {
        customer: {
          type: "individual",
          email: customer.email,
          name: customer.nome,
          document: customer.cpf,
          document_type: "CPF",
        }
      },
      layout_settings: {
        image_url: "https://tourism-saas-web-git-main-carlossiiqueiras-projects.vercel.app/images/prados/logo_laranja.png",
        primary_color: "#dd7f11"
      }
    }

    if (area_code && number) {
      Object.assign(phones, {
        home_phone: {
          country_code,
          area_code,
          number
        }

      })
    }

    if (area_code_mobile && number_mobile) {
      Object.assign(phones, {
        mobile_phone: {
          country_code,
          area_code: area_code_mobile,
          number: number_mobile
        }
      })
    }

    if (requestLink.customer_settings.customer && phones) {
      Object.assign(requestLink.customer_settings.customer, {
        phones: {
          ...phones
        }
      });
    }

    if (paymentMethod.includes('pix')) {
      Object.assign(requestLink.payment_settings, {
        pix_settings: {
          ...pixSettings
        }
      })
    }

    if (opcionaisItems.length) {
      requestLink.cart_settings.items = requestLink.cart_settings.items.concat(opcionaisItems)
    }

    const paymentLink = await pagarme.post('/paymentlinks', requestLink)

    response.send(paymentLink.data).status(201)
  }
}

export { FinanceiroController }

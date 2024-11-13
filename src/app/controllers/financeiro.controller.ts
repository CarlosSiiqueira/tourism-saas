import { FinanceiroRepository } from '../repositories/financeiro.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { FinanceiroService } from '../services/financeiro.service'
import { formatIndexFilters } from '../../shared/utils/filters'
import { proccessPacotesId } from '../../shared/utils/webHookBody'
import { FormaPagamentoService } from '../services/forma.pagamento.service'
import { PacoteService } from '../services/pacote.service'
import { ReservaService } from '../services/reserva.service'
import { EnderecoService } from '../services/endereco.service'
import { PessoaService } from '../services/pessoa.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'
import { ContaBancariaService } from '../services/conta.bancaria.service'
import { LogService } from '../services/log.service'
import { ComissaoService } from '../services/comissao.service'

@injectable()
class FinanceiroController {
  constructor (
    @inject("FinanceiroRepository")
    private financeiroRepository: FinanceiroRepository,
    private financeiroService: FinanceiroService,
    private formaPagamentoService: FormaPagamentoService,
    private pacoteService: PacoteService,
    private reservaService: ReservaService,
    private pessoaService: PessoaService,
    private enderecoService: EnderecoService,
    private excursaoPassageiroService: ExcursaoPassageiroService,
    private contaBancariaService: ContaBancariaService,
    private logService: LogService,
    private comissaoService: ComissaoService
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

  createByHook = async (request: Request, response: Response): Promise<void> => {

    const formaPagamento = await this.formaPagamentoService.findByName(request.body.payment_method_title)
    let dataCliente = request.body.billing

    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    const pessoa = await this.pessoaService.findByCpf(request.body.billing.cpf)
    let codigoCliente = pessoa?.id || ''

    if (!pessoa) {
      const endereco = await this.enderecoService.findByCepAndNumber(dataCliente.postcode, dataCliente.number);
      let codigoEndereco = endereco?.id || ''

      if (!endereco) {
        const newEndereco = await this.enderecoService.create({
          logradouro: `${dataCliente.address_1} ${dataCliente.address_2}` || '',
          numero: dataCliente.number || '',
          complemento: '',
          cep: dataCliente.postcode || '',
          cidade: dataCliente.city || '',
          bairro: dataCliente.neighborhood || '',
          uf: dataCliente.state || ''
        })
        codigoEndereco = newEndereco
      }

      const cliente = await this.pessoaService.create({
        nome: `${dataCliente.first_name} ${dataCliente.last_name}`,
        cpf: dataCliente.cpf,
        sexo: dataCliente.gender ? dataCliente.gender : 'M',
        email: dataCliente.email,
        telefone: dataCliente.phone,
        dataNascimento: dataCliente.birthdate || null,
        observacoes: 'cadastrado via compra site',
        telefoneWpp: null,
        contato: null,
        telefoneContato: null,
        usuarioCadastro: '1',
        rg: dataCliente.rg,
        emissor: dataCliente.orgaoEmissor || null
      }, codigoEndereco)

      codigoCliente = cliente
    }

    request.body.tipo = 2
    request.body.valor = parseFloat(request.body.total)
    request.body.vistoAdmin = false
    request.body.efetivado = false
    request.body.observacao = 'teste'
    request.body.ativo = true
    request.body.numeroComprovanteBancario = null
    // request.body.idWP = request.body.transaction_id
    request.body.idWP = 1
    request.body.codigoPessoa = codigoCliente
    request.body.codigoFornecedor = null
    request.body.codigoExcursao = '608b47ea-b5d4-484e-ab20-802db35d699f'
    request.body.codigoProduto = null
    request.body.codigoPacote = '351c992b-64f7-49a3-9ce7-0b606a2616a0'
    request.body.codigoFormaPagamento = formaPagamento.id
    request.body.codigoContaBancaria = null
    request.body.codigoCategoria = '1'
    request.body.usuarioCadastro = '1'
    request.body.data = new Date()

    const reserva = await this.reservaService.create({
      idExcursao: request.body.codigoExcursao,
      passageiros: [codigoCliente],
      codigoUsuario: '1',
      desconto: 0,
      localEmbarqueId: '1',
      criancasColo: 0
    })

    request.body.reserva = reserva
    const financeiro = await this.financeiroRepository.create(request.body)
    const passageiro = await this.excursaoPassageiroService.create({
      idExcursao: '608b47ea-b5d4-484e-ab20-802db35d699f',
      idPassageiro: codigoCliente,
      localEmbarque: '1',
      reserva: reserva
    })

    response.status(200).send(reserva)
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
}

export { FinanceiroController }

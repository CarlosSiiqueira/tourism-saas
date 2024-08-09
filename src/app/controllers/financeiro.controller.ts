import { FinanceiroRepository } from '../repositories/financeiro.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from 'express'
import { FinanceiroService } from '../services/financeiro.service'
import { FormaPagamentoRepository } from '../repositories/forma.pagamento.repository'
import { formatIndexFilters } from '../../shared/utils/filters'
import { PacoteRepository } from '../repositories/pacote.repository'
import { proccessPacotesId } from '../../shared/utils/webHookBody'
import { IPacoteResponse } from '../interfaces/Pacote'
import { ReservaRepository } from '../repositories/reserva.repository'
import { PessoaRepository } from '../repositories/pessoa.repository'
import { EnderecoRepository } from '../repositories/endereco.repository'
import { ExcursaoPassageirosRepository } from '../repositories/excursao.passageiros.repository'

@injectable()
class FinanceiroController {
  constructor(
    @inject("FinanceiroRepository")
    private financeiroRepository: FinanceiroRepository,
    private financeiroService: FinanceiroService = new FinanceiroService(financeiroRepository),
    @inject("FormaPagamentoRepository")
    private formaPagamentoRepository: FormaPagamentoRepository,
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository,
    @inject("ReservaRepository")
    private reservaRepository: ReservaRepository,
    @inject("PessoaRepository")
    private pessoaRepository: PessoaRepository,
    @inject("EnderecoRepository")
    private enderecoRepository: EnderecoRepository,
    @inject("ExcursaoPassageirosRepository")
    private excursaoPassageiro: ExcursaoPassageirosRepository
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const res = await this.financeiroRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    const formaPagamento = await this.formaPagamentoRepository.find(request.body.formaPagamento)

    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    const res = await this.financeiroRepository.create(request.body)

    response.status(200).send(res)
  }

  createByHook = async (request: Request, response: Response): Promise<void> => {

    const formaPagamento = await this.formaPagamentoRepository.findByName(request.body.payment_method_title)
    let dataCliente = request.body.billing

    request.body.dataPrevistaRecebimento = await this.financeiroService.setDataPrevistaPagamento(formaPagamento.qtdDiasRecebimento)

    const pessoa = await this.pessoaRepository.findByCpf(request.body.billing.cpf)
    let codigoCliente = pessoa?.id || ''

    if (!pessoa) {
      const endereco = await this.enderecoRepository.findByCepAndNumber(dataCliente.postcode, dataCliente.number);
      let codigoEndereco = endereco?.id || ''

      if (!endereco) {
        const newEndereco = await this.enderecoRepository.create({
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

      const cliente = await this.pessoaRepository.create({
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
        usuarioCadastro: '1'
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

    const financeiro = await this.financeiroRepository.create(request.body)
    const reserva = await this.reservaRepository.create({ reserva: `#${request.body.number}`, codigoFinanceiro: financeiro, codigoUsuario: '1' })
    const passageiro = await this.excursaoPassageiro.create({
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

    const res = await this.financeiroRepository.update(request.body, request.params.id)

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroRepository.delete(request.params.id)

    response.status(200).send(res)
  }

  setVistoAdmin = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroService.setVistoAdmin(request.body.visto, request.params.id)

    response.status(200).send(res)
  }

  efetivarTransacao = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroService.efetivarTransacao(request.body, request.params.id)
    await this.financeiroService.confirmaPagamentoWoo(request.params.id)

    response.status(200).send(res)
  }

  desEfetivar = async (request: Request, response: Response): Promise<void> => {

    const res = await this.financeiroService.desEfetivar(request.params.id)

    response.status(200).send(res)
  }

  createFromHook = async (request: Request, response: Response): Promise<void> => {

    const ids = proccessPacotesId(request.body);

    if (ids.length) {
      var pacote = await this.pacoteRepository.getAllByIds(ids);

      if (pacote.length) {
        const res = await this.financeiroService.proccessCreateTransaction(request.body, pacote)

        response.status(200).send(res)
        return;
      }
    }

    response.status(301).send('Pacotes não encontrados')
  }

  clone = async (request: Request, response: Response): Promise<void> => {

    const clonedTransaction = await this.financeiroRepository.find(request.params.id)

    if (clonedTransaction) {
      const id = await this.financeiroRepository.create(clonedTransaction)
      response.status(200).send(id)
      return;
    }

    response.status(301).send('Não foi possivel realizar procedimento')

  }

}

export { FinanceiroController }

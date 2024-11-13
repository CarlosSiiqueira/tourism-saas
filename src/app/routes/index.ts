import { Router } from "express"
import { contaBancaria } from "../routes/conta.bancaria.routes"
import { excursao } from "../routes/excursao.routes"
import { financeiro } from "../routes/financeiro.routes"
import { formaPagamento } from "../routes/forma.pagamento.routes"
import { pacote } from "../routes/pacote.routes"
import { pessoa } from "../routes/pessoa.routes"
import { produto } from "../routes/produto.routes"
import { usuario } from "../routes/usuario.routes"
import { excursaoQuartos } from "../routes/excursao.quartos.routes"
import { excursaoOnibus } from "../routes/excursao.onibus.routes"
import { endereco } from "../routes/endereco.routes"
import { localEmbarque } from "../routes/local.embarque.routes"
import { vendas } from "../routes/vendas.routes"
import { destinos } from "../routes/destinos.routes"
import { fornecedor } from "../routes/fornecedor.routes"
import { excursaoPassageiros } from "./excursao.passageiros.routes"
import { passageiroEmbarque } from "./passageiro.embarque.routes"
import { categoriaTransacao } from "./categoria.transacao.routes"
import { tipoQuarto } from "./tipo.quarto.routes"
import { reserva } from "./reserva.routes"
import { subCategoriaTransacao } from "./subcategoria.transacao.routes"
import { relatorios } from "./relatorios.routes"
import { ranking } from "./ranking.clientes.routes"
import { files } from "./files.routes"
import { creditoCliente } from "./credito.cliente.routes"
import { opcionais } from "./opcionais.routes"
import { logs } from "./log.routes"
import { opcionalEmbarque } from "./opcionais.embarque.routes"
import { configuracao } from "./configuracoes.routes"
import { comissao } from "./comissao.routes"
import { excursaoLocalEmbarque } from "./excursao.local.embarque.routes"

const router = Router()

router.use('/conta-bancaria', contaBancaria)
router.use('/excursao', excursao)
router.use('/financeiro', financeiro)
router.use('/forma-pagamento', formaPagamento)
router.use('/pacotes', pacote)
router.use('/pessoas', pessoa)
router.use('/produtos', produto)
router.use('/usuarios', usuario)
router.use('/excursao-quartos', excursaoQuartos)
router.use('/excursao-onibus', excursaoOnibus)
router.use('/endereco', endereco)
router.use('/local-embarque', localEmbarque)
router.use('/vendas', vendas)
router.use('/destinos', destinos)
router.use('/fornecedor', fornecedor)
router.use('/excursao-passageiros', excursaoPassageiros)
router.use('/passageiro-embarque', passageiroEmbarque)
router.use('/categoria-transacao', categoriaTransacao)
router.use('/tipo-quarto', tipoQuarto)
router.use('/reserva', reserva)
router.use('/sub-categoria', subCategoriaTransacao)
router.use('/relatorios', relatorios)
router.use('/ranking-clientes', ranking)
router.use('/files', files)
router.use('/credito-cliente', creditoCliente)
router.use('/opcionais', opcionais)
router.use('/log', logs)
router.use('/opcional-embarque', opcionalEmbarque)
router.use('/configuracoes', configuracao)
router.use('/comissao', comissao)
router.use('/excursao-local-embarque', excursaoLocalEmbarque)

export { router }

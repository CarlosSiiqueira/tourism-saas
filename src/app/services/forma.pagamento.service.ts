import { inject, injectable } from "tsyringe";
import { FormaPagamentoRepository } from "../repositories/forma.pagamento.repository";
import { IFormaPagamentoResponse } from "../interfaces/FormaPagamento";


@injectable()
export class FormaPagamentoService {

  constructor(
    @inject("FormaPagamentoRepository")
    private formaPagamentoRepository: FormaPagamentoRepository
  ) { }

  findByName = async (nome: string): Promise<IFormaPagamentoResponse> => {

    const formaPagamento = await this.formaPagamentoRepository.findByName(nome)

    return formaPagamento
  }

  find = async (id: string): Promise<IFormaPagamentoResponse> => {

    const formaPagamento = await this.formaPagamentoRepository.find(id)

    return formaPagamento
  }

  calculateTaxes = async (valor: number, id: string, qtdParcelas: number): Promise<number> => {

    let taxa: number = 0
    const formaPagamento = await this.formaPagamentoRepository.find(id)

    switch (qtdParcelas) {
      case 1:
        taxa = formaPagamento.taxa
        break;

      case 2:
        taxa = formaPagamento.taxa2x || 0
        break;

      case 3:
        taxa = formaPagamento.taxa3x || 0
        break;

      case 4:
        taxa = formaPagamento.taxa4x || 0
        break;

      case 5:
        taxa = formaPagamento.taxa5x || 0
        break;
      case 6:
        taxa = formaPagamento.taxa6x || 0
        break;

      case 7:
        taxa = formaPagamento.taxa7x || 0
        break;

      case 8:
        taxa = formaPagamento.taxa8x || 0
        break;

      case 9:
        taxa = formaPagamento.taxa9x || 0
        break;

      case 10:
        taxa = formaPagamento.taxa10x || 0
        break;

      case 11:
        taxa = formaPagamento.taxa11x || 0
        break;

      case 12:
        taxa = formaPagamento.taxa12x || 0
        break;
    }

    valor -= valor * taxa / 100

    return valor
  }
}

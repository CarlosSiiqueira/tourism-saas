import { inject, injectable } from "tsyringe";
import { ContaBancariaRepository } from "../repositories/conta.bancaria.repository";


@injectable()
export class ContaBancariaService {

  constructor(
    @inject("ContaBancariaRepository")
    private contaBancariaRepository: ContaBancariaRepository
  ) { }

  movimentar = async (id: string, valor: number, tipoMovimentacao: string): Promise<string> => {

    const conta = await this.contaBancariaRepository.find(id)

    if (conta) {
      valor = tipoMovimentacao == 'C' ? conta.saldo + valor : conta.saldo - valor

      const contaBancaria = await this.contaBancariaRepository.setSaldo(id, valor);

      return `Novo saldo: ${contaBancaria.saldo}`
    }

    return 'Conta não encontrada'
  }

}
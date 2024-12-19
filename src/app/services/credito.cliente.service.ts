import { inject, injectable } from "tsyringe";
import { CreditoClienteRepository } from "../repositories/credito.cliente.repository";
import { ICreditoClienteDTO, ICreditoClienteResponse } from "../interfaces/CreditoCliente";


@injectable()
export class CreditoClienteService {

  constructor (
    @inject('CreditoClienteRepository')
    private creditoClienteRepository: CreditoClienteRepository
  ) { }


  create = async (data: ICreditoClienteDTO): Promise<string> => {

    const credito = await this.creditoClienteRepository.create(data)

    return credito
  }

  update = async (data: ICreditoClienteDTO, id: string): Promise<ICreditoClienteResponse> => {

    const credito = await this.creditoClienteRepository.update(data, id)

    return credito
  }

  delete = async (id: string): Promise<ICreditoClienteResponse> => {

    const credito = await this.creditoClienteRepository.delete(id)

    return credito
  }

  findByCliente = async (idCliente: string): Promise<ICreditoClienteResponse[]> => {

    const credito = await this.creditoClienteRepository.findByCliente(idCliente)

    return credito
  }

  setUtilizadoEm = async (id: string, date: Date, valor: number): Promise<string> => {
    return await this.creditoClienteRepository.setUtilizadoEm(id, date, valor)
  }
}

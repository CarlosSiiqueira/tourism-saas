import { OpcionaisEmbarqueRepository } from '../repositories/opcionais.embarque.repository'
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { formatIndexFilters } from '../../shared/utils/filters'
import { LogService } from '../services/log.service'
import { ExcursaoPassageiroService } from '../services/excursao.passageiro.service'

@injectable()
class OpcionaisEmbarqueController {
  constructor(
    @inject("OpcionaisEmbarqueRepository")
    private opcionaisEmbarqueRepository: OpcionaisEmbarqueRepository,
    private logService: LogService,
    private excursaoPassageiroService: ExcursaoPassageiroService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'data')

    const idExcursao = request.params.idExcursao
    const opcionalId = request.params.id

    const data = await this.opcionaisEmbarqueRepository.index({ orderBy, order, skip, take, filter }, opcionalId)

    const allPassageiros = await this.excursaoPassageiroService.find(idExcursao)

    const opcionaisEmbarque = await Promise.all(
      allPassageiros.map(async (passageiro) => {
        const optEmbarque = await this.opcionaisEmbarqueRepository.findByPessoaExcursao(passageiro.id, idExcursao, opcionalId)

        return {
          ...passageiro,
          embarcou: optEmbarque?.embarcou || false,
          hasBoarded: optEmbarque?.id || '',
          data: optEmbarque?.data || ''
        }
      })
    )

    response.status(200).send({ count: data.count, rows: opcionaisEmbarque })
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.opcionaisEmbarqueRepository.create(request.body)

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Opcionais Embarque',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.opcionaisEmbarqueRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.opcionaisEmbarqueRepository.findAll();

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const opcionalEmbarque = await this.opcionaisEmbarqueRepository.delete(request.params.id)

    if (opcionalEmbarque) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(opcionalEmbarque),
        rotina: 'Opcionais Embarque',
        usuariosId: user.id
      })
    }

    response.status(200).send(opcionalEmbarque)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const oldOpcionalEmbarque = await this.opcionaisEmbarqueRepository.find(request.params.id)
    const opcionalEmbarque = await this.opcionaisEmbarqueRepository.update(request.body, request.params.id)

    if (opcionalEmbarque) {
      await this.logService.create({
        tipo: 'UPDATE',
        newData: JSON.stringify({ id: request.params.id, ...request.body }),
        oldData: JSON.stringify(oldOpcionalEmbarque),
        rotina: 'Opcionais Embarque',
        usuariosId: user.id
      })
    }

    response.status(200).send(opcionalEmbarque)
  }
}

export { OpcionaisEmbarqueController }

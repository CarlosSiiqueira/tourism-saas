import { inject, injectable } from "tsyringe";
import { PassageiroEmbarqueRepository } from "../repositories/passageiro.embarque.repository";
import { Request, Response } from 'express'
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";
import { EmailService } from "../services/mail.service";
import { htmlEmailViagem } from "../../shared/helper/html";
import { ExcursaoPassageiroService } from "../services/excursao.passageiro.service";

@injectable()
class PassageiroEmbarqueController {

  constructor (
    @inject("PassageiroEmbarqueRepository")
    private passageiroEmbarqueRepository: PassageiroEmbarqueRepository,
    private logService: LogService,
    private emailService: EmailService,
    private excursaoPassageiroService: ExcursaoPassageiroService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {
    const { orderBy, order, skip, take, filter } = formatIndexFilters(request)

    const res = await this.passageiroEmbarqueRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);
    const { codigoExcursao } = request.body
    const { codigoPassageiro } = request.body

    const res = await this.passageiroEmbarqueRepository.create(request.body)

    const passageiros = await this.excursaoPassageiroService.find(codigoExcursao)

    const passageiro = passageiros.find((pessoa) => { return pessoa.id == codigoPassageiro })

    await this.emailService.sendEmail(
      passageiro?.Pessoa.email || '',
      'Prados Turismo te deseja uma boa viagem',
      htmlEmailViagem(passageiro?.Pessoa.nome || '', passageiro?.Excursao.nome || ''),
      3
    )

    await this.logService.create({
      tipo: 'CREATE',
      newData: JSON.stringify({ id: res, ...request.body }),
      oldData: null,
      rotina: 'Excursão/Passageiro Embarque',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findByExcursao = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.findByExcursao(request.params.idExcursao)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.findAll()

    response.status(200).send(res)
  }

  embarqueDesembarque = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const res = await this.passageiroEmbarqueRepository.embarqueDesembarque(request.body)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ acao: res, ...request.body }),
      oldData: null,
      rotina: 'Excursão/Passageiro Embarque',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  embarqueQRCode = async (request: Request, response: Response): Promise<void> => {

    const res = await this.passageiroEmbarqueRepository.embarqueQRCode(request.params.idPassageiro, request.params.idExcursao)

    response.status(200).send(res)
  }
}

export { PassageiroEmbarqueController }

import { injectable, inject } from "tsyringe";
import { ImagensRepository } from "../repositories/imagens.repository";
import { Request, Response } from "express";
import { formatIndexFilters } from "../../shared/utils/filters";
import { LogService } from "../services/log.service";
import path from 'path'
import { checkFile, removeFile, uploadImage } from "../../shared/utils/file";

@injectable()
class ImagensController {

  constructor (
    @inject("ImagensRepository")
    private imagensRepository: ImagensRepository,
    private logService: LogService
  ) { }

  index = async (request: Request, response: Response): Promise<void> => {

    const { orderBy, order, skip, take, filter } = formatIndexFilters(request, 'dataUpload')

    const res = await this.imagensRepository.index({ orderBy, order, skip, take, filter })

    response.status(200).send(res)
  }

  create = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);
    let res = 'Arquivo já existe';

    const { nome, userId, image } = request.body
    const url = `${request.protocol}://${request.get('host')}/images/${nome}`
    const imagePath = path.join(__dirname, `../../../public/images/${nome}`)

    let fileExists = await checkFile(imagePath)

    if (!fileExists) {
      uploadImage(image, nome, imagePath)

      res = await this.imagensRepository.create({ nome, url, userId })

      await this.logService.create({
        tipo: 'CREATE',
        newData: JSON.stringify({ id: res, ...request.body }),
        oldData: null,
        rotina: 'Galeria/Imagens',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }

  find = async (request: Request, response: Response): Promise<void> => {

    const res = await this.imagensRepository.find(request.params.id)

    response.status(200).send(res)
  }

  findAll = async (request: Request, response: Response): Promise<void> => {

    const res = await this.imagensRepository.findAll()

    response.status(200).send(res)
  }

  update = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);

    const categoriaTransacao = await this.imagensRepository.find(request.params.id)
    const res = await this.imagensRepository.update(request.body, request.params.id)

    await this.logService.create({
      tipo: 'UPDATE',
      newData: JSON.stringify({ id: request.params.id, ...request.body }),
      oldData: JSON.stringify(categoriaTransacao),
      rotina: 'Galeria/Imagens',
      usuariosId: user.id
    })

    response.status(200).send(res)
  }

  delete = async (request: Request, response: Response): Promise<void> => {

    let user = JSON.parse(request.headers.user as string);


    const res = await this.imagensRepository.delete(request.params.id)

    const imagePath = path.join(__dirname, `../../../public/images/${res.nome}`)

    await removeFile(imagePath)

    if (res) {
      await this.logService.create({
        tipo: 'DELETE',
        newData: null,
        oldData: JSON.stringify(res),
        rotina: 'Galeria/Imagens',
        usuariosId: user.id
      })
    }

    response.status(200).send(res)
  }
}

export { ImagensController }

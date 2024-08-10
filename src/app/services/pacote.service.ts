import { inject, injectable } from "tsyringe"
import { wooCommerce } from "../api/woocommerce"
import { wordPress } from "../api/wordpress.rest"
import { Warning } from "../errors"
import { IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"
import { PacoteRepository } from "../repositories/pacote.repository"
import { wordPressEvents } from "../api/wordpressEvents"

@injectable()
export class PacoteService {

  constructor(
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository
  ) { }

  listImagesPacote = async (search: string): Promise<[string]> => {

    let filter: string = ''

    if (search.length) {
      filter = `&search=${search}`
    }

    try {

      const response = await wordPress.get<any>(`wp-json/wp/v2/media?per_page=100${filter}`)

      const images = response.data.map(function (img: any) {
        return img.link
      })

      return images
    } catch (error: any) {
      throw new Warning(error.response.data.message, 400)
    }
  }

  createProductWp = async (dados: IPacoteDTO): Promise<any> => {

    const data = {
      name: dados.nome,
      type: "booking",
      // regular_price: `${dados.valor}`,
      description: dados.descricao,
      short_description: dados.descricao,
      categories: [
        {
          id: dados.categoria
        }
      ],
      images: [
        {
          src: dados.urlImagem
        }
      ]
    }

    try {
      const response = await wooCommerce.post('products', data)

      return response.data
    } catch (error: any) {
      throw new Warning(error.response.data.message, 400)
    }
  }

  updatePacoteWP = async (dados: IPacoteResponse): Promise<any> => {

    const data = {
      name: dados.nome,
      // regular_price: `${dados.valor}`,
      description: dados.descricao,
      short_description: dados.descricao,
      catalog_visibility: dados.ativo ? 'visible' : 'hidden',
      images: [
        {
          src: dados.urlImagem
        }
      ]
    }

    const pacoteWP = await wooCommerce.put(`products/${dados.idWP}`, data)

    return pacoteWP.data
  }

  createEvent = async (tittle: string, dataInicio: string, dataFim: string, decricao: string): Promise<any> => {

    const dados = {
      author: 1,
      title: tittle,
      date: dataInicio,
      description: decricao,
      status: "publish",
      start_date: dataInicio,
      end_date: dataFim,
      imagem: "https://wess.blog/logo-64d273967e6ff868052792198aabe5f9c0c94135-1-webp/"
    }

    const d = await wordPressEvents.post('wp-json/tribe/events/v1/events', dados)

    return d
  }

  getAllByIds = async (ids: Array<number>): Promise<IPacoteResponse[]> => {

    const pacotes = await this.pacoteRepository.getAllByIds(ids)

    return pacotes
  }

  find = async (id: string): Promise<IPacoteResponse> => {

    const pacote = await this.pacoteRepository.find(id)

    return pacote
  }

  setIdWP = async (id: string, idWP: number): Promise<string[]> => {

    const pacote = await this.pacoteRepository.setIdWP(id, idWP)

    return pacote
  }
}

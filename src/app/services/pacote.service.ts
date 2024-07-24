import { wooCommerce } from "../api/woocommerce"
import { wordPress } from "../api/wordpress.rest"
import { Warning } from "../errors"
import { IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote"

export class PacoteService {
  
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
}

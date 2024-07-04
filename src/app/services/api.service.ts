import axios from "axios"
import { injectable, inject } from "tsyringe";
import { DestinosRepository } from '../repositories/destinos.repository'
import { IPacoteDTO, IPacoteResponse } from "../interfaces/Pacote";
import { wooCommerce } from "../api/woocommerce";
import { wordPress } from "../api/wordpress.rest";
import { Warning } from "../errors";

interface Cep {
  uf: string
  cidade: string
  bairro: string
  tipo_logradouro: string
  logradouro: string
  cep: string
  resultado_txt: string
}

interface Cidade {
  name: string
  displayName: string
}

@injectable()
export class ApiService {

  constructor(
    @inject("DestinosRepository")
    private destinosRepository: DestinosRepository

  ) { }

  buscaCep = async (cep: string): Promise<Cep> => {

    const endereco = await axios.get<Cep>(`http://cep.republicavirtual.com.br/web_cep.php?cep=${cep}&formato=json`)

    return endereco.data

  }

  buscaCidade = async (search: string): Promise<any> => {
    var cidades: Cidade[] = [];
    const response = await axios.get<any>(`https://nominatim.openstreetmap.org/search?q=${search}&format=json&limit=3`)

    if (response.data.length) {

      response.data.forEach((element: any) => {
        element.display_name = element.display_name.split(',')
        let country = element.display_name.find((element: any) => element.toUpperCase().trim() == 'BRASIL')
        element.display_name = `${element.display_name[0]},${element.display_name[4]},${country || ''}`
      });

      cidades = response.data.map((item: any) => ({
        name: item.name,
        displayName: item.display_name
      }));

      for (const city of cidades) {
        await this.insertDestino(city.displayName);
      }
    }

    return cidades;
  }

  insertDestino = async (nome: string): Promise<any> => {

    const destino = await this.destinosRepository.findByName(nome)

    if (!destino) {
      await this.destinosRepository.create(nome)
    }
  }

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
      regular_price: `${dados.valor}`,
      description: dados.descricao,
      short_description: dados.descricao,
      categories: [
        {
          id: 35 // pacote
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
      regular_price: `${dados.valor}`,
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

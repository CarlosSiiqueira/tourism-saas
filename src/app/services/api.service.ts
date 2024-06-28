import axios from "axios"

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

export class ApiService {

  buscaCep = async (cep: string): Promise<Cep> => {

    const endereco = await axios.get<Cep>(`http://cep.republicavirtual.com.br/web_cep.php?cep=${cep}&formato=json`)

    return endereco.data

  }

  buscaCidade = async (search: string): Promise<any> => {

    const response = await axios.get<any>(`https://nominatim.openstreetmap.org/search?q=${search}&format=json&limit=3`)

    response.data.forEach((element: any) => {
      element.display_name = element.display_name.split(',')
      let country = element.display_name.find((element: any) => element.toUpperCase().trim() == 'BRASIL')
      element.display_name = `${element.display_name[0]},${element.display_name[4]},${country || ''}`

    });

    const cidades: Cidade[] = response.data.map((item: any) => ({
      name: item.name,
      displayName: item.display_name
    }));

    return cidades;
  }

}

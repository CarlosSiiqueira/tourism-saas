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

export class ApiService {

  buscaCep = async (cep: string): Promise<Cep> => {

    const endereco = await axios.get<Cep>(`http://cep.republicavirtual.com.br/web_cep.php?cep=${cep}&formato=json`)

    return endereco.data

  }

}

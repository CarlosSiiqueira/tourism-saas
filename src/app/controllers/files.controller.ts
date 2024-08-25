import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { PessoaService } from "../services/pessoa.service";
import { format } from 'fast-csv';
import { Readable } from 'stream';
import { ExcursaoQuartosService } from "../services/excursao.quarto.service";
import { ExcursaoPassageiroService } from "../services/excursao.passageiro.service";

@injectable()
class FilesController {

  constructor(
    private pessoaService: PessoaService,
    private excursaoQuartosService: ExcursaoQuartosService,
    private excursaoPassageiroService: ExcursaoPassageiroService
  ) { }

  generateCsvPessoas = async (request: Request, response: Response): Promise<void> => {

    response.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');

    const pessoas = await this.pessoaService.findAll()

    const jsonData = pessoas.map((pessoa) => {
      let endereco = {}
      let ranking = {}
      delete pessoa.rankingClientesId

      if (pessoa.Endereco.length) {
        endereco = pessoa.Endereco[0]
        delete pessoa.Endereco
      }

      if (pessoa.Ranking) {
        ranking = pessoa.Ranking.nome
        delete pessoa.Ranking
      }

      return {
        ...pessoa,
        ...endereco,
        ...ranking
      }
    })

    const csvStream = format({ headers: true });
    const readableStream = Readable.from(jsonData);

    readableStream.pipe(csvStream).pipe(response);
  }

  generateCsvQuartos = async (request: Request, response: Response): Promise<void> => {

    response.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');

    const quartos = await this.excursaoQuartosService.find(request.params.idExcursao)

    const jsonData = quartos.map((quarto) => {
      let excursao = {}
      let passageiro = { hospede: '' }
      let tipoQuarto = { tipoQuarto: '' }

      excursao = quarto.Excursao.nome
      const passageiroQuarto = quarto.Passageiros.map((passageiro) => {
        return `${passageiro.Reservas.reserva} - ${passageiro.Pessoa.nome}`
      })

      passageiro.hospede += passageiroQuarto.map((passageiro) => {
        return `${passageiro},`
      })

      passageiro.hospede = passageiro.hospede.replace(/,$/, '');
      tipoQuarto.tipoQuarto = quarto.TipoQuarto?.nome || ''

      return {
        ...quarto,
        ...excursao,
        ...passageiro,
        ...tipoQuarto
      }
    })

    const csvStream = format({ headers: true });
    const readableStream = Readable.from(jsonData);

    readableStream.pipe(csvStream).pipe(response);
  }

  generateCsvPassageiros = async (request: Request, response: Response): Promise<void> => {

    response.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');

    const passageiros = await this.excursaoPassageiroService.find(request.params.idExcursao)

    const jsonData = passageiros.map((quarto) => {
      return {
        'Excursão': quarto.Excursao.nome,
        'Reserva': quarto.reserva,
        'Passageiro': quarto.Pessoa.nome,
        'Local de Embarque': quarto.LocalEmbarque.nome
      }
    })

    const csvStream = format({ headers: true });
    const readableStream = Readable.from(jsonData);

    readableStream.pipe(csvStream).pipe(response);
  }
}

export { FilesController }

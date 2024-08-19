import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { PessoaService } from "../services/pessoa.service";
import { format } from 'fast-csv';
import { Readable } from 'stream';

@injectable()
class FilesController {

  constructor(
    private pessoaService: PessoaService
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
}

export { FilesController }

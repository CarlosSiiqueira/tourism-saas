import { inject, injectable } from "tsyringe";
import { PessoaRepository } from "../repositories/pessoa.repository";
import { IPessoaDTO, IPessoaReportResponse, IPessoaResponse } from "../interfaces/Pessoa";
import { IIndex } from "../interfaces/Helper";

@injectable()
export class PessoaService {

  constructor(
    @inject("PessoaRepository")
    private pessoaRepository: PessoaRepository
  ) { }


  findByCpf = async (cpf: string): Promise<IPessoaResponse | null> => {

    const pessoa = await this.pessoaRepository.findByCpf(cpf)

    return pessoa;
  }

  create = async ({
    nome,
    cpf,
    sexo,
    observacoes,
    telefone,
    telefoneWpp,
    email,
    contato,
    telefoneContato,
    dataNascimento,
    usuarioCadastro,
    rg,
    emissor }: IPessoaDTO, codigoEndereco: string): Promise<string> => {

    const pessoa = await this.pessoaRepository.create({
      nome,
      cpf,
      sexo,
      observacoes,
      telefone,
      telefoneWpp,
      email,
      contato,
      telefoneContato,
      dataNascimento,
      usuarioCadastro,
      rg,
      emissor
    }, codigoEndereco)


    return pessoa
  }

  index = async (data: IIndex): Promise<{ rows: IPessoaResponse[], count: number }> => {

    const pessoas = await this.pessoaRepository.index(data)


    return pessoas
  }

  findAll = async (): Promise<any[]> => {

    const pessoas = await this.pessoaRepository.findAll()

    return pessoas
  }
}

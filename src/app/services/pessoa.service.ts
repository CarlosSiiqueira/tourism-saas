import { inject, injectable } from "tsyringe";
import { PessoaRepository } from "../repositories/pessoa.repository";
import { IPessoaDTO, IPessoaResponse } from "../interfaces/Pessoa";

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
    rg }: IPessoaDTO, codigoEndereco: string): Promise<string> => {

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
      rg
    }, codigoEndereco)


    return pessoa
  }
}

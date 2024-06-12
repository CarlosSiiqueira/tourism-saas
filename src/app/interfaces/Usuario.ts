export interface IUsuario {
    create(data: IUsuarioDTO): Promise<string[]>
    find(id: string): Promise<IUsuarioResponse | null>
    findAll(): Promise<IUsuarioResponse[]>
    delete(id: string): Promise<string[]>
    update(data: IUsuarioDTO, id: string): Promise<string[]>
    login(username: string, password: string): Promise<IUsuarioResponse | null>
}


export interface IUsuarioDTO {
    nome: string
    username: string
    password: string
    dataCadastro: Date
    usuarioCadastro: string | null
    tipo: number
    email: string
    ativo: boolean
    comissao: number | null
    meta: number | null
}

export interface IUsuarioResponse extends IUsuarioDTO {
    id: string
}

export interface IUsuarioLogin extends IUsuarioDTO {
    username: string
    password: string
}

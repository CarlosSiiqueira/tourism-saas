import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { injectable, inject } from 'tsyringe';

interface User {
  id: string
  username: string
}

@injectable()
export class AuthService {
  private secretKey: string

  constructor(
    @inject("UsuarioRepository")
    private usuarioRepository: UsuarioRepository
  ) {
    this.secretKey = process.env.JWT_SECRET_KEY || ''
  }

  async authenticate(username: string, password: string): Promise<string | null> {
    const user = await this.usuarioRepository.login(username, password)

    if (!user) {
      return null
    }

    return jwt.sign({ id: user.id, username: user.username }, this.secretKey, { expiresIn: '1d' });
  }

  verifyToken = async (token: string): Promise<User | null> => {
    try {
      const payload = jwt.verify(token, this.secretKey) as { id: string };
      const user = await this.usuarioRepository.find(payload.id)

      if (user) {
        return { id: payload.id, username: user.username };
      }

      return null

    } catch (error) {
      return null;
    }
  }

}

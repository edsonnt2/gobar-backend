import { sign, verify } from 'jsonwebtoken';
import Auth from '@config/Auth';
import IAuthProvider from '../models/IAuthProvider';
import ITokenDTO from '../Dtos/ITokenDTO';

class JwtProvider implements IAuthProvider {
  public signIn(id: string): string {
    const { secret, expiresIn } = Auth;

    return sign({}, secret, { subject: id, expiresIn });
  }

  public verifyToken(token: string): ITokenDTO {
    const decoded = verify(token, Auth.secret);
    return decoded as ITokenDTO;
  }
}

export default JwtProvider;

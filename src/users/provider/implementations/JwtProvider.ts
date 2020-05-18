import { sign } from 'jsonwebtoken';
import Auth from '../../../config/Auth';
import IAuthProvider from '../models/IAuthProvider';

class JwtProvider implements IAuthProvider {
  public signIn(id: string): string {
    const { secret, expiresIn } = Auth;

    return sign({}, secret, { subject: id, expiresIn });
  }
}

export default JwtProvider;

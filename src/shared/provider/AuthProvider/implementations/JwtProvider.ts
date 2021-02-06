import { sign, verify } from 'jsonwebtoken';
import Auth from '@config/auth';
import IAuthProvider from '../models/IAuthProvider';
import ITokenDTO from '../Dtos/ITokenDTO';
import ISignInDTO from '../Dtos/ISignInDTO';

class JwtProvider implements IAuthProvider {
  public signIn({ user_id, business_id }: ISignInDTO): string {
    const { secret, expiresIn } = Auth;

    return sign({}, secret, {
      subject: JSON.stringify({ user_id, business_id }),
      expiresIn,
    });
  }

  public verifyToken(token: string): ITokenDTO {
    const decoded = verify(token, Auth.secret);
    return decoded as ITokenDTO;
  }
}

export default JwtProvider;

import ITokenDTO from '../Dtos/ITokenDTO';
import ISignInDTO from '../Dtos/ISignInDTO';

export default interface IAuthProvider {
  signIn({ user_id, business_id }: ISignInDTO): string;
  verifyToken(token: string): ITokenDTO;
}

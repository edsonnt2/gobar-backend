import ITokenDTO from '../Dtos/ITokenDTO';

export default interface IAuthProvider {
  signIn(id: string): string;
  verifyToken(token: string): ITokenDTO;
}

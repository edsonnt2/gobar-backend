import IAuthProvider from '../models/IAuthProvider';
import ITokenDTO from '../Dtos/ITokenDTO';

class FakeAuthProvider implements IAuthProvider {
  public signIn(): string {
    return 'fhfuiaheh9fy9y945yr9f09f7070s7fa0f7d8v7ds0897fd98';
  }

  public verifyToken(token: string): ITokenDTO {
    return {
      exp: token,
      iat: 'fake',
      sub: 'fhfuiaheh9fy9y945yr9f09f7070s7fa0f7d8v7ds0897fd98',
    } as ITokenDTO;
  }
}

export default FakeAuthProvider;

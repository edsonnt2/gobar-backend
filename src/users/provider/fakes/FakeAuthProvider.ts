import IAuthProvider from '../models/IAuthProvider';

class FakeAuthProvider implements IAuthProvider {
  public signIn(): string {
    return 'fhfuiaheh9fy9y945yr9f09f7070s7fa0f7d8v7ds0897fd98';
  }
}

export default FakeAuthProvider;

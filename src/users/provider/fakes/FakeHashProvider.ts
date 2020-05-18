import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(password: string): Promise<string> {
    return password;
  }

  public async compareHash(
    password: string,
    hashedCompare: string,
  ): Promise<boolean> {
    return password === hashedCompare;
  }
}

export default FakeHashProvider;

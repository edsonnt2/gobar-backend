import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(password: string): Promise<string> {
    return hash(password, 8);
  }

  public async compareHash(
    password: string,
    hashedCompare: string,
  ): Promise<boolean> {
    return compare(password, hashedCompare);
  }
}

export default FakeHashProvider;

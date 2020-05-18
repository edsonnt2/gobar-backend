import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../provider/models/IHashProvider';
import IAuthProvider from '../provider/models/IAuthProvider';
import User from '../typeorm/entities/User';

interface IRequest {
  cellPhoneOrEmail: string | number;
  password: string;
}

class AuthenticationUserService {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private authProvider: IAuthProvider,
  ) {}

  public async execute({
    cellPhoneOrEmail,
    password,
  }: IRequest): Promise<{ user: User; token: string }> {
    let user: User | undefined;

    switch (typeof cellPhoneOrEmail) {
      case 'number':
        user = await this.userRepository.findByCellPhone(cellPhoneOrEmail);
        break;
      default:
        user = await this.userRepository.findByEmail(cellPhoneOrEmail);
        break;
    }

    if (!user) throw new Error('Credentials is required.');

    const compareHashed = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!compareHashed) throw new Error('Credentials is required.');

    const token = this.authProvider.signIn(user.id);

    return { user, token };
  }
}

export default AuthenticationUserService;

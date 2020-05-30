import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../provider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  cellPhoneOrEmail: string;
  password: string;
}

@injectable()
class AuthenticationUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('AuthProvider')
    private authProvider: IAuthProvider,
  ) {}

  public async execute({
    cellPhoneOrEmail,
    password,
  }: IRequest): Promise<{ user: User; token: string }> {
    let user;

    user = await this.userRepository.findByEmail(cellPhoneOrEmail);

    if (!user) {
      const formattedToNumber = cellPhoneOrEmail
        .split('')
        .filter(char => Number(char) || char === '0')
        .join('');
      user = await this.userRepository.findBycellPhone(
        Number(formattedToNumber),
      );
    }

    if (!user) throw new AppError('Credentials is required');

    const compareHashed = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!compareHashed) throw new AppError('Credentials is required');

    const token = this.authProvider.signIn({ user_id: user.id });

    return { user, token };
  }
}

export default AuthenticationUserService;

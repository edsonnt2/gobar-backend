import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class BackAuthenticationUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AuthProvider')
    private authProvider: IAuthProvider,
  ) {}

  public async execute({
    user_id,
  }: IRequest): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const token = this.authProvider.signIn({ user_id: user.id });

    return { user, token };
  }
}

export default BackAuthenticationUserService;

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
  business_id: string;
}

@injectable()
class AuthenticationBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AuthProvider')
    private authProvider: IAuthProvider,
  ) {}

  public async execute({
    user_id,
    business_id,
  }: IRequest): Promise<{ business: Business; token: string }> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found.');

    if (business.user_id !== user.id)
      throw new AppError('not authorized to login into this business.');

    const token = this.authProvider.signIn({ user_id, business_id });

    return { business, token };
  }
}

export default AuthenticationBusinessService;

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
}

@injectable()
class ListBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Business[]> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const business = await this.businessRepository.findByUserId(user_id);

    return business;
  }
}

export default ListBusinessService;

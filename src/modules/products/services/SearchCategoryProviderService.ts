import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICategoryProviderRepository from '../repositories/ICategoryProviderRepository';
import CategoryProvider from '../infra/typeorm/entities/CategoryProvider';

interface IRequest {
  user_id: string;
  search: string;
}

@injectable()
class CreateCategoryProviderService {
  constructor(
    @inject('CategoryProviderRepository')
    private CategoryProviderRepository: ICategoryProviderRepository,

    @inject('UserRepository')
    private UserRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
    search,
  }: IRequest): Promise<CategoryProvider[]> {
    const user = await this.UserRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const categories = await this.CategoryProviderRepository.searchInCategory(
      search,
    );

    return categories;
  }
}

export default CreateCategoryProviderService;

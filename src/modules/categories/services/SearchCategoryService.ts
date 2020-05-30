import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICategoryRepository from '../repositories/ICategoryRepository';
import Category from '../infra/typeorm/entities/Category';

interface IRequest {
  user_id: string;
  search: string;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoryRepository')
    private CategoryRepository: ICategoryRepository,

    @inject('UserRepository')
    private UserRepository: IUserRepository,
  ) {}

  public async execute({ user_id, search }: IRequest): Promise<Category[]> {
    const user = await this.UserRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const categories = await this.CategoryRepository.searchInCategory(search);

    return categories;
  }
}

export default CreateCategoryService;

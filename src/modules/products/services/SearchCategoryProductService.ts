import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICategoryProductRepository from '../repositories/ICategoryProductRepository';
import CategoryProduct from '../infra/typeorm/entities/CategoryProduct';

interface IRequest {
  user_id: string;
  search: string;
}

@injectable()
class CreateCategoryProductService {
  constructor(
    @inject('CategoryProductRepository')
    private CategoryProductRepository: ICategoryProductRepository,

    @inject('UserRepository')
    private UserRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
    search,
  }: IRequest): Promise<CategoryProduct[]> {
    const user = await this.UserRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const categories = await this.CategoryProductRepository.searchInCategory(
      search,
    );

    return categories;
  }
}

export default CreateCategoryProductService;

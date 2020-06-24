import { getRepository, Repository, Like } from 'typeorm';
import CategoryProvider from '@modules/products/infra/typeorm/entities/CategoryProvider';
import ICreateCategoryProviderDTO from '@modules/products/Dtos/ICreateCategoryProviderDTO';
import ICategoryProviderRepository from '@modules/products/repositories/ICategoryProviderRepository';

class CategoryProviderRepository implements ICategoryProviderRepository {
  private ormRepository: Repository<CategoryProvider>;

  constructor() {
    this.ormRepository = getRepository(CategoryProvider);
  }

  public async create(
    data: ICreateCategoryProviderDTO[],
  ): Promise<CategoryProvider[]> {
    const categories = this.ormRepository.create(data);

    await this.ormRepository.save(categories);

    return categories;
  }

  public async searchInCategory(search: string): Promise<CategoryProvider[]> {
    const categories = await this.ormRepository.find({
      where: {
        name: Like(`%${search.toLowerCase()}%`),
      },
      take: 15,
    });

    return categories;
  }
}

export default CategoryProviderRepository;

import { getRepository, Repository, Like } from 'typeorm';
import Category from '@modules/categories/infra/typeorm/entities/Category';
import ICreateCategoryDTO from '@modules/categories/Dtos/ICreateCategoryDTO';
import ICategoryRepository from '@modules/categories/repositories/ICategoryRepository';

class FakeCategoryRepository implements ICategoryRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create(data: ICreateCategoryDTO[]): Promise<Category[]> {
    const categories = this.ormRepository.create(data);

    await this.ormRepository.save(categories);

    return categories;
  }

  public async searchInCategory(search: string): Promise<Category[]> {
    const categories = await this.ormRepository.find({
      where: {
        name: Like(`%${search}%`),
      },
      take: 15,
    });

    return categories;
  }
}

export default FakeCategoryRepository;

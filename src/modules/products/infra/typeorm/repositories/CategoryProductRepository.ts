import { getRepository, Repository, Like } from 'typeorm';
import CategoryProduct from '@modules/products/infra/typeorm/entities/CategoryProduct';
import ICreateCategoryProductDTO from '@modules/products/Dtos/ICreateCategoryProductDTO';
import ICategoryProductRepository from '@modules/products/repositories/ICategoryProductRepository';

class CategoryProductRepository implements ICategoryProductRepository {
  private ormRepository: Repository<CategoryProduct>;

  constructor() {
    this.ormRepository = getRepository(CategoryProduct);
  }

  public async create(
    data: ICreateCategoryProductDTO[],
  ): Promise<CategoryProduct[]> {
    const categories = this.ormRepository.create(data);

    await this.ormRepository.save(categories);

    return categories;
  }

  public async searchInCategory(search: string): Promise<CategoryProduct[]> {
    const categories = await this.ormRepository.find({
      where: {
        name: Like(`%${search.toLowerCase()}%`),
      },
      take: 15,
    });

    return categories;
  }
}

export default CategoryProductRepository;

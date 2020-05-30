import Category from '@modules/categories/infra/typeorm/entities/Category';
import ICreateCategoryDTO from '@modules/categories/Dtos/ICreateCategoryDTO';
import ICategoryRepository from '../ICategoryRepository';

class FakeCategoryRepository implements ICategoryRepository {
  private categories: Category[] = [];

  public async create(data: ICreateCategoryDTO[]): Promise<Category[]> {
    const category = new Category();

    this.categories = data.map(({ name }) => {
      Object.assign(category, { id: '274234498fsdf34548', name });
      return category;
    });

    return this.categories;
  }

  public async searchInCategory(search: string): Promise<Category[]> {
    const findCategories = this.categories.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );

    return findCategories;
  }
}

export default FakeCategoryRepository;

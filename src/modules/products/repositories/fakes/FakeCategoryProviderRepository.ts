import CategoryProvider from '@modules/products/infra/typeorm/entities/CategoryProvider';
import ICreateCategoryProviderDTO from '@modules/products/Dtos/ICreateCategoryProviderDTO';
import ICategoryProviderRepository from '../ICategoryProviderRepository';

class FakeCategoryProviderRepository implements ICategoryProviderRepository {
  private categoriesProvider: CategoryProvider[] = [];

  public async create(
    data: ICreateCategoryProviderDTO[],
  ): Promise<CategoryProvider[]> {
    const categoryProvider = new CategoryProvider();

    this.categoriesProvider = data.map(({ name }) => {
      Object.assign(categoryProvider, { id: '274234498fsdf34548', name });
      return categoryProvider;
    });

    return this.categoriesProvider;
  }

  public async searchInCategory(search: string): Promise<CategoryProvider[]> {
    const findCategories = this.categoriesProvider.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );

    return findCategories;
  }
}

export default FakeCategoryProviderRepository;

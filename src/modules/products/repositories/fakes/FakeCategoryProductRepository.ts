import CategoryProduct from '@modules/products/infra/typeorm/entities/CategoryProduct';
import ICreateCategoryProductDTO from '@modules/products/Dtos/ICreateCategoryProductDTO';
import ICategoryProductRepository from '../ICategoryProductRepository';

class FakeCategoryProductRepository implements ICategoryProductRepository {
  private categoriesProduct: CategoryProduct[] = [];

  public async create(
    data: ICreateCategoryProductDTO[],
  ): Promise<CategoryProduct[]> {
    const categoryProduct = new CategoryProduct();

    this.categoriesProduct = data.map(({ name }) => {
      Object.assign(categoryProduct, { id: '274234498fsdf34548', name });
      return categoryProduct;
    });

    return this.categoriesProduct;
  }

  public async searchInCategory(search: string): Promise<CategoryProduct[]> {
    const findCategories = this.categoriesProduct.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );

    return findCategories;
  }
}

export default FakeCategoryProductRepository;

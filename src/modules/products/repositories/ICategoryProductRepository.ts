import CategoryProduct from '../infra/typeorm/entities/CategoryProduct';
import ICreateCategoryProductDTO from '../Dtos/ICreateCategoryProductDTO';

export default interface ICategoryProductRepository {
  create(data: ICreateCategoryProductDTO[]): Promise<CategoryProduct[]>;
  searchInCategory(search: string): Promise<CategoryProduct[]>;
}

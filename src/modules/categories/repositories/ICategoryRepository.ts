import Category from '../infra/typeorm/entities/Category';
import ICreateCategoryDTO from '../Dtos/ICreateCategoryDTO';

export default interface ICategoryRepository {
  create(data: ICreateCategoryDTO[]): Promise<Category[]>;
  searchInCategory(search: string): Promise<Category[]>;
}

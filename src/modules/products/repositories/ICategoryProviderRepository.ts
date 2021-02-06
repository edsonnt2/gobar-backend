import CategoryProvider from '../infra/typeorm/entities/CategoryProvider';
import ICreateCategoryProviderDTO from '../Dtos/ICreateCategoryProviderDTO';

export default interface ICategoryProviderReposity {
  create(data: ICreateCategoryProviderDTO[]): Promise<CategoryProvider[]>;
  searchInCategory(search: string): Promise<CategoryProvider[]>;
}

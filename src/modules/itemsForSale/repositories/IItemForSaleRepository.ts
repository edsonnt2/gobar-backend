import ItemForSale from '../infra/typeorm/entities/ItemForSale';
import ICreateItemForSaleDTO from '../Dtos/ICreateItemForSaleDTO';
import IGetAllItemForSaleDTO from '../Dtos/IGetAllItemForSaleDTO';

export default interface IItemForSaleRepository {
  create(data: ICreateItemForSaleDTO[]): Promise<ItemForSale[]>;
  getAll({ command_id }: IGetAllItemForSaleDTO): Promise<ItemForSale[]>;
  findById(id: string): Promise<ItemForSale | undefined>;
  delete(item_product_id: string): Promise<void>;
}

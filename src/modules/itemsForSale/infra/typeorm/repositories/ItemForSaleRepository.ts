import { Repository, getRepository } from 'typeorm';
import ItemForSale from '@modules/itemsForSale/infra/typeorm/entities/ItemForSale';
import ICreateItemForSaleDTO from '@modules/itemsForSale/Dtos/ICreateItemForSaleDTO';
import IItemForSaleRepository from '@modules/itemsForSale/repositories/IItemForSaleRepository';
import IGetAllItemForSaleDTO from '@modules/itemsForSale/Dtos/IGetAllItemForSaleDTO';

class ItemForSaleRepository implements IItemForSaleRepository {
  private ormReposity: Repository<ItemForSale>;

  constructor() {
    this.ormReposity = getRepository(ItemForSale);
  }

  public async create(data: ICreateItemForSaleDTO[]): Promise<ItemForSale[]> {
    const itemForSale = this.ormReposity.create(data);

    await this.ormReposity.save(itemForSale);

    return itemForSale;
  }

  public async getAll({
    command_id,
  }: IGetAllItemForSaleDTO): Promise<ItemForSale[]> {
    const itemForSale = await this.ormReposity.find({ command_id });

    return itemForSale;
  }

  public async findById(id: string): Promise<ItemForSale | undefined> {
    return this.ormReposity.findOne({
      id,
    });
  }

  public async delete(item_product_id: string): Promise<void> {
    await this.ormReposity.delete({
      id: item_product_id,
    });
  }
}

export default ItemForSaleRepository;

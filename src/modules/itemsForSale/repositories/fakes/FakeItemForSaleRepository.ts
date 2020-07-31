import crypto from 'crypto';
import ItemForSale from '@modules/itemsForSale/infra/typeorm/entities/ItemForSale';
import ICreateItemForSaleDTO from '@modules/itemsForSale/Dtos/ICreateItemForSaleDTO';
import IGetAllItemForSaleDTO from '@modules/itemsForSale/Dtos/IGetAllItemForSaleDTO';
import IItemForSaleRepository from '../IItemForSaleRepository';

class FakeItemForSaleRepository implements IItemForSaleRepository {
  private itemsForSale: ItemForSale[] = [];

  public async create(data: ICreateItemForSaleDTO[]): Promise<ItemForSale[]> {
    data.forEach(query => {
      const itemForSale = new ItemForSale();
      const id = crypto.randomBytes(6).toString('hex');
      Object.assign(itemForSale, { id }, query);

      this.itemsForSale.push(itemForSale);
    });

    return this.itemsForSale;
  }

  public async getAll({
    command_id,
  }: IGetAllItemForSaleDTO): Promise<ItemForSale[]> {
    const itemForSale = this.itemsForSale.filter(
      filCommand => filCommand.command_id === command_id,
    );

    return itemForSale;
  }

  public async findById(id: string): Promise<ItemForSale | undefined> {
    return this.itemsForSale.find(get => get.id === id);
  }

  public async delete(item_product_id: string): Promise<void> {
    const itemIndex = this.itemsForSale.findIndex(
      getIndex => getIndex.id === item_product_id,
    );

    delete this.itemsForSale[itemIndex];
  }
}

export default FakeItemForSaleRepository;

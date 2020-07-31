import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import IProductRepository from '@modules/products/repositories/IProductRepository';
import removeAccents from '@shared/utils/removeAccents';
import Table from '@modules/tables/infra/typeorm/entities/Table';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import ITableRepository from '@modules/tables/repositories/ITableRepository';
import IItemForSaleRepository from '../repositories/IItemForSaleRepository';
import ItemForSale from '../infra/typeorm/entities/ItemForSale';
import ICreateItemForSaleDTO from '../Dtos/ICreateItemForSaleDTO';

interface IRequest {
  user_id: string;
  business_id: string;
  command?: number;
  table?: number;
  products: {
    product_id?: string;
    description?: string;
    value?: number;
    quantity: number;
  }[];
}

@injectable()
class CreateItemForSaleService {
  constructor(
    @inject('ItemForSaleRepository')
    private itemForSaleRepository: IItemForSaleRepository,

    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('TableRepository')
    private tableRepository: ITableRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    business_id,
    user_id,
    command,
    table,
    products,
  }: IRequest): Promise<ItemForSale[]> {
    let itemRegister: Command | Table;
    let whichItem: 'command_id' | 'table_id';

    if (command) {
      const commandRegister = await this.commandRepository.findByNumber({
        number: command,
        business_id,
      });

      if (!commandRegister)
        throw new AppError('Command not found at this Business');

      itemRegister = commandRegister;
      whichItem = 'command_id';
    } else if (table) {
      const tableRegister = await this.tableRepository.findByNumber({
        number: table,
        business_id,
      });

      if (!tableRegister)
        throw new AppError('Table not found at this Business');

      itemRegister = tableRegister;
      whichItem = 'table_id';
    } else {
      throw new AppError('Command or Table is required');
    }

    const ids = products
      .map(({ product_id }) => product_id || '')
      .filter(id => id !== '');

    const findProducts = await this.productRepository.findByIds(ids);

    const newProducts = products.map<ICreateItemForSaleDTO>(data => {
      if (!data.product_id) {
        if (!data.description)
          throw new AppError('Description is required for product diverse');

        if (!data.value)
          throw new AppError('Value is required for product diverse');

        return {
          [whichItem]: itemRegister.id,
          operator_id: user_id,
          label_description: removeAccents(data.description)
            .toLowerCase()
            .trim(),
          description: data.description,
          quantity: data.quantity,
          product_id: data.product_id,
          value: data.value,
        };
      }

      const indexProduct = findProducts.findIndex(
        ({ id }) => id === data.product_id,
      );

      if (indexProduct < 0) throw new AppError('Product id not found');

      const {
        id,
        description,
        label_description,
        sale_value,
        quantity,
      } = findProducts[indexProduct];
      if (quantity < data.quantity)
        throw new AppError(`Product with quantity insufficient|${id}`);

      const newQuantity = findProducts[indexProduct].quantity - data.quantity;
      findProducts[indexProduct].quantity = newQuantity;

      return {
        [whichItem]: itemRegister.id,
        operator_id: user_id,
        product_id: id,
        description,
        label_description,
        value: sale_value,
        quantity: data.quantity,
      };
    });

    const productsSave = await this.itemForSaleRepository.create(newProducts);

    await this.productRepository.saveArray(findProducts);

    return productsSave;
  }
}

export default CreateItemForSaleService;

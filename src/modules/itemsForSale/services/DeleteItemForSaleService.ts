import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import IProductRepository from '@modules/products/repositories/IProductRepository';
import ITableRepository from '@modules/tables/repositories/ITableRepository';
import IItemForSaleRepository from '../repositories/IItemForSaleRepository';

interface IRequest {
  business_id: string;
  command_id?: string;
  table_id?: string;
  item_product_id: string;
}

@injectable()
class DeleteItemForSaleService {
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
    command_id,
    table_id,
    item_product_id,
  }: IRequest): Promise<void> {
    if (command_id) {
      const commandRegister = await this.commandRepository.findById({
        id: command_id,
      });

      if (!commandRegister) throw new AppError('Command not found');

      if (commandRegister.business_id !== business_id)
        throw new AppError('Command not found at this Business');
    } else if (table_id) {
      const tableRegister = await this.tableRepository.findById({
        id: table_id,
      });

      if (!tableRegister) throw new AppError('Table not found');

      if (tableRegister.business_id !== business_id)
        throw new AppError('Table not found at this Business');
    } else {
      throw new AppError('Command or Table is required');
    }

    const item_product = await this.itemForSaleRepository.findById(
      item_product_id,
    );

    if (!item_product) throw new AppError('Product in Command not found');

    if (command_id && item_product.command_id !== command_id)
      throw new AppError('Product not found at this Command');

    if (table_id && item_product.table_id !== table_id)
      throw new AppError('Product not found at this Table');

    await this.itemForSaleRepository.delete(item_product_id);

    if (item_product.product_id) {
      const product = await this.productRepository.findById(
        item_product.product_id,
      );

      if (product) {
        product.quantity += item_product.quantity;

        await this.productRepository.save(product);
      }
    }
  }
}

export default DeleteItemForSaleService;

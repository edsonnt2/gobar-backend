import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import IProductRepository from '@modules/products/repositories/IProductRepository';
import removeAccents from '@shared/utils/removeAccents';
import ICommandProductRepository from '../repositories/ICommandProductRepository';
import CommandProduct from '../infra/typeorm/entities/CommandProduct';
import ICreateCommandProdutcDTO from '../Dtos/ICreateCommandProdutcDTO';

interface IRequest {
  business_id: string;
  command: number;
  products: {
    product_id?: string;
    description?: string;
    value?: number;
    quantity: number;
  }[];
}

@injectable()
class CreateCommandProductService {
  constructor(
    @inject('CommandProductRepository')
    private commandProductRepository: ICommandProductRepository,

    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    business_id,
    command,
    products,
  }: IRequest): Promise<CommandProduct[]> {
    const commandRegister = await this.commandRepository.findByNumber({
      number: command,
      business_id,
    });

    if (!commandRegister)
      throw new AppError('Command not found at this Business');

    const ids = products
      .map(({ product_id }) => product_id || '')
      .filter(id => id !== '');

    const findProducts = await this.productRepository.findByIds(ids);

    const newProducts = products.map<ICreateCommandProdutcDTO>(data => {
      if (!data.product_id) {
        if (!data.description)
          throw new AppError('Description is required for product diverse');

        if (!data.value)
          throw new AppError('Value is required for product diverse');

        return {
          command_id: commandRegister.id,
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
        command_id: commandRegister.id,
        product_id: id,
        description,
        label_description,
        value: sale_value,
        quantity: data.quantity,
      };
    });

    const productsSave = await this.commandProductRepository.create(
      newProducts,
    );

    await this.productRepository.saveArray(findProducts);

    return productsSave;
  }
}

export default CreateCommandProductService;

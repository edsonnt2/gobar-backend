import CommandProduct from '@modules/commandsProducts/infra/typeorm/entities/CommandProduct';
import ICreateCommandProdutcDTO from '@modules/commandsProducts/Dtos/ICreateCommandProdutcDTO';
import crypto from 'crypto';
import ICommandProductRepository from '../ICommandProductRepository';

class FakeCommandProductRepository implements ICommandProductRepository {
  private commandsProducts: CommandProduct[] = [];

  public async create(
    data: ICreateCommandProdutcDTO[],
  ): Promise<CommandProduct[]> {
    data.forEach(query => {
      const commandProduct = new CommandProduct();
      const id = crypto.randomBytes(6).toString('hex');
      Object.assign(commandProduct, { id }, query);

      this.commandsProducts.push(commandProduct);
    });

    return this.commandsProducts;
  }

  public async getAll(command_id: string): Promise<CommandProduct[]> {
    const commandProduct = this.commandsProducts.filter(
      filCommand => filCommand.command_id === command_id,
    );

    return commandProduct;
  }
}

export default FakeCommandProductRepository;

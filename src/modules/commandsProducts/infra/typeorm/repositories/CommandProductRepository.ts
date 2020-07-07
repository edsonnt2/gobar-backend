import { Repository, getRepository } from 'typeorm';
import CommandProduct from '@modules/commandsProducts/infra/typeorm/entities/CommandProduct';
import ICreateCommandProdutcDTO from '@modules/commandsProducts/Dtos/ICreateCommandProdutcDTO';
import ICommandProductRepository from '@modules/commandsProducts/repositories/ICommandProductRepository';

class CommandProductRepository implements ICommandProductRepository {
  private ormReposity: Repository<CommandProduct>;

  constructor() {
    this.ormReposity = getRepository(CommandProduct);
  }

  public async create(
    data: ICreateCommandProdutcDTO[],
  ): Promise<CommandProduct[]> {
    const commandProduct = this.ormReposity.create(data);

    await this.ormReposity.save(commandProduct);

    return commandProduct;
  }

  public async getAll(command_id: string): Promise<CommandProduct[]> {
    const commandProduct = await this.ormReposity.find({ command_id });

    return commandProduct;
  }
}

export default CommandProductRepository;

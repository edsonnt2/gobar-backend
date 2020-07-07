import ICreateCommandProdutcDTO from '../Dtos/ICreateCommandProdutcDTO';
import CommandProduct from '../infra/typeorm/entities/CommandProduct';

export default interface ICommandProductRepository {
  create(data: ICreateCommandProdutcDTO[]): Promise<CommandProduct[]>;
  getAll(command_id: string): Promise<CommandProduct[]>;
}

import Command from '@modules/commands/infra/typeorm/entities/Command';
import ICreateIngressDTO from '@modules/commands/Dtos/ICreateCommandDTO';
import IFindByNumberCommandDTO from '@modules/commands/Dtos/IFIndByNumberCommandDTO';
import IFindByCustomerCommandDTO from '@modules/commands/Dtos/IFIndByCustomerCommandDTO';
import IDeleteByIdCommandDTO from '@modules/commands/Dtos/IDeleteByIdCommandDTO';
import ISearchCommandDTO from '@modules/commands/Dtos/ISearchCommandDTO';
import ICommandRepository from '../ICommandRepository';

class FakeCommandRepository implements ICommandRepository {
  private commands: Command[] = [];

  public async create(data: ICreateIngressDTO): Promise<Command> {
    const command = new Command();

    Object.assign(command, { id: '274234498fsdf34548' }, data);

    this.commands.push(command);

    return command;
  }

  public async findByNumber({
    number,
    business_id,
  }: IFindByNumberCommandDTO): Promise<Command | undefined> {
    const command = this.commands.find(
      findCommand =>
        findCommand.number === number &&
        findCommand.business_id === business_id,
    );

    return command;
  }

  public async getAll(business_id: string): Promise<Command[]> {
    const command = this.commands.filter(
      filCommand => filCommand.business_id === business_id,
    );

    return command;
  }

  public async findById(id: string): Promise<Command | undefined> {
    const command = this.commands.find(findCommand => findCommand.id === id);

    return command;
  }

  public async findByCustomer({
    customer_id,
    business_id,
  }: IFindByCustomerCommandDTO): Promise<Command | undefined> {
    const command = this.commands.find(
      findCommand =>
        findCommand.customer_id === customer_id &&
        findCommand.business_id === business_id,
    );

    return command;
  }

  public async search({
    search,
    business_id,
  }: ISearchCommandDTO): Promise<Command[]> {
    const isNumber = search
      .split('')
      .filter(char => Number(char) || char === '0')
      .join('');

    // const newSearch = removeAccents(search).toLowerCase().trim();

    const findCommands = this.commands.filter(
      command =>
        // (
        String(command.number).includes(isNumber) &&
        // command.customer.label_name.includes(newSearch) ||
        // String(command.customer.cell_phone).includes(isNumber) ||
        // command.customer.email.includes(newSearch) ||
        // String(command.customer.cpf_or_cnpj).includes(isNumber)) &&
        command.business_id === business_id,
    );

    return findCommands;
  }

  public async deleteById({
    id,
    business_id,
  }: IDeleteByIdCommandDTO): Promise<void> {
    const findIndex = this.commands.findIndex(
      findCommand =>
        findCommand.id === id && findCommand.business_id === business_id,
    );

    delete this.commands[findIndex];
  }
}

export default FakeCommandRepository;

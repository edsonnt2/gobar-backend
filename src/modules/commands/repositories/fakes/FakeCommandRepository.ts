import crypto from 'crypto';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import ICreateCommandDTO from '@modules/commands/Dtos/ICreateCommandDTO';
import IFindByNumberCommandDTO from '@modules/commands/Dtos/IFIndByNumberCommandDTO';
import IFindByCustomerCommandDTO from '@modules/commands/Dtos/IFIndByCustomerCommandDTO';
import IDeleteByIdCommandDTO from '@modules/commands/Dtos/IDeleteByIdCommandDTO';
import ISearchCommandDTO from '@modules/commands/Dtos/ISearchCommandDTO';
import IFindByIdsCommandDTO from '@modules/commands/Dtos/IFindByIdsCommandDTO';
import IAllCommandDTO from '@modules/commands/Dtos/IAllCommandDTO';
import IFindByIdCommandDTO from '@modules/commands/Dtos/IFindByIdCommandDTO';
import ICommandRepository from '../ICommandRepository';

class FakeCommandRepository implements ICommandRepository {
  private commands: Command[] = [];

  public async create(data: ICreateCommandDTO): Promise<Command> {
    const command = new Command();

    const idCommand = crypto.randomBytes(6).toString('hex');

    Object.assign(command, { id: idCommand }, data);

    this.commands.push(command);

    return command;
  }

  public async findByNumber({
    number,
    business_id,
    closed,
  }: IFindByNumberCommandDTO): Promise<Command | undefined> {
    const command = this.commands.find(findCommand => {
      const openOrClose = closed
        ? !!findCommand.command_closure_id
        : !findCommand.command_closure_id;
      return (
        findCommand.number === number &&
        findCommand.business_id === business_id &&
        openOrClose
      );
    });

    return command;
  }

  public async getAll({
    business_id,
    closed,
  }: IAllCommandDTO): Promise<Command[]> {
    const command = this.commands.filter(filCommand => {
      const openOrClose = closed
        ? !!filCommand.command_closure_id
        : !filCommand.command_closure_id;
      return filCommand.business_id === business_id && openOrClose;
    });

    return command;
  }

  public async findById({
    id,
    closed,
  }: IFindByIdCommandDTO): Promise<Command | undefined> {
    const command = this.commands.find(findCommand => {
      const openOrClose = closed
        ? !!findCommand.command_closure_id
        : !findCommand.command_closure_id;
      return findCommand.id === id && openOrClose;
    });

    return command;
  }

  public async findByIds({
    ids,
    business_id,
    closed,
  }: IFindByIdsCommandDTO): Promise<Command[]> {
    const command = this.commands.filter(filterCommand => {
      const openOrClose = closed
        ? !!filterCommand.command_closure_id
        : !filterCommand.command_closure_id;
      return (
        ids.some(id => id === filterCommand.id) &&
        filterCommand.business_id === business_id &&
        openOrClose
      );
    });

    return command;
  }

  public async findByCustomer({
    customer_id,
    business_id,
    closed,
  }: IFindByCustomerCommandDTO): Promise<Command | undefined> {
    const command = this.commands.find(findCommand => {
      const openOrClose = closed
        ? !!findCommand.command_closure_id
        : !findCommand.command_closure_id;
      return (
        findCommand.customer_id === customer_id &&
        findCommand.business_id === business_id &&
        openOrClose
      );
    });

    return command;
  }

  public async search({
    search,
    business_id,
    closed,
  }: ISearchCommandDTO): Promise<Command[]> {
    const isNumber = search
      .split('')
      .filter(char => Number(char) || char === '0')
      .join('');

    const findCommands = this.commands.filter(command => {
      const openOrClose = closed
        ? !!command.command_closure_id
        : !command.command_closure_id;
      return (
        String(command.number).includes(isNumber) &&
        command.business_id === business_id &&
        openOrClose
      );
    });

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

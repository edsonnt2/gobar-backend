import { Repository, getRepository, IsNull, Not, ObjectLiteral } from 'typeorm';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import ICreateCommandDTO from '@modules/commands/Dtos/ICreateCommandDTO';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import IFindByNumberCommandDTO from '@modules/commands/Dtos/IFIndByNumberCommandDTO';
import IFindByCustomerCommandDTO from '@modules/commands/Dtos/IFIndByCustomerCommandDTO';
import IDeleteByIdCommandDTO from '@modules/commands/Dtos/IDeleteByIdCommandDTO';
import ISearchCommandDTO from '@modules/commands/Dtos/ISearchCommandDTO';
import removeAccents from '@shared/utils/removeAccents';
import IFindByIdsCommandDTO from '@modules/commands/Dtos/IFindByIdsCommandDTO';
import IAllCommandDTO from '@modules/commands/Dtos/IAllCommandDTO';
import IFindByIdCommandDTO from '@modules/commands/Dtos/IFindByIdCommandDTO';

class CommandRepository implements ICommandRepository {
  private ormRepository: Repository<Command>;

  constructor() {
    this.ormRepository = getRepository(Command);
  }

  public async create({
    operator_id,
    business_id,
    customer_id,
    number,
    value_ingress,
    ingress_consume,
    prepaid_ingress,
    value_consume,
  }: ICreateCommandDTO): Promise<Command> {
    const command = this.ormRepository.create({
      operator_id,
      business_id,
      customer_id,
      number,
      value_ingress,
      ingress_consume,
      prepaid_ingress,
      value_consume,
    });

    await this.ormRepository.save(command);

    return command;
  }

  public async findByNumber({
    number,
    business_id,
    closed,
  }: IFindByNumberCommandDTO): Promise<Command | undefined> {
    const hasClosed = closed
      ? 'AND command.command_closure_id IS NOT NULL'
      : 'AND command.command_closure_id IS NULL';

    const command = await this.ormRepository
      .createQueryBuilder('command')
      .leftJoinAndSelect('command.command_product', 'command_product')
      .leftJoinAndSelect('command_product.operator', 'operator')
      .leftJoinAndSelect('command_product.product', 'product')
      .leftJoinAndSelect('command.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'command',
        'command_product',
        'product.image',
        'operator.name',
        'operator.avatar',
        'customer.name',
        'user.avatar',
      ])
      .where(
        `command.number=:number AND command.business_id=:business_id ${hasClosed}`,
        {
          number,
          business_id,
        },
      )
      .orderBy({
        'command_product.id': 'DESC',
      })
      .getOne();

    return command;
  }

  public async getAll({
    business_id,
    closed,
  }: IAllCommandDTO): Promise<Command[]> {
    const hasClosed = closed ? Not(IsNull()) : IsNull();

    const command = await this.ormRepository.find({
      relations: ['customer'],
      where: {
        business_id,
        command_closure_id: hasClosed,
      },
    });

    return command;
  }

  public async findById({
    id,
    closed,
  }: IFindByIdCommandDTO): Promise<Command | undefined> {
    const hasClosed = closed ? Not(IsNull()) : IsNull();

    const command = await this.ormRepository.findOne({
      where: {
        id,
        command_closure_id: hasClosed,
      },
    });

    return command;
  }

  public async findByIds({
    ids,
    business_id,
    closed,
  }: IFindByIdsCommandDTO): Promise<Command[]> {
    const hasClosed = closed ? Not(IsNull()) : IsNull();

    const commands = await this.ormRepository.findByIds(ids, {
      where: {
        business_id,
        command_closure_id: hasClosed,
      },
    });

    return commands;
  }

  public async findByCustomer({
    customer_id,
    business_id,
    closed,
  }: IFindByCustomerCommandDTO): Promise<Command | undefined> {
    const hasClosed = closed ? Not(IsNull()) : IsNull();

    const command = await this.ormRepository.findOne({
      customer_id,
      business_id,
      command_closure_id: hasClosed,
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
    const newSearch = removeAccents(search).toLowerCase().trim();

    const searchSql: string[] = [];
    let parameters: ObjectLiteral = {};

    newSearch.split(' ').forEach((searchSeparator, index) => {
      const isNumberSeparator = searchSeparator
        .split('')
        .filter(char => Number(char) || char === '0')
        .join('');

      const queryNumberSeparator =
        isNumber !== ''
          ? `command.number LIKE :number${String(
              index,
            )} OR customer.cell_phone LIKE :number${String(index)} OR
          customer.cpf_or_cnpj LIKE :number${String(index)} OR `
          : '';

      if (isNumber !== '') {
        parameters = {
          ...parameters,
          [`number${String(index)}`]: `%${isNumberSeparator}%`,
        };
      }

      searchSql.push(
        `(${queryNumberSeparator}customer.label_name LIKE :search${String(
          index,
        )} OR customer.email LIKE :search${String(index)})`,
      );

      parameters = {
        ...parameters,
        [`search${String(index)}`]: `%${searchSeparator}%`,
      };
    });

    const hasClosed = closed
      ? 'AND command.command_closure_id IS NOT NULL'
      : 'AND command.command_closure_id IS NULL';

    parameters = {
      ...parameters,
      bid: business_id,
    };

    const commands = await this.ormRepository
      .createQueryBuilder('command')
      .innerJoinAndSelect('command.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'command.id',
        'command.number',
        'command.command_closure_id',
        'customer.id',
        'customer.name',
        'user.avatar',
      ])
      .where(
        `${searchSql.join(' AND ')} AND command.business_id=:bid ${hasClosed}`,
        parameters,
      )
      .limit(20)
      .getMany();

    return commands;
  }

  public async deleteById({
    id,
    business_id,
  }: IDeleteByIdCommandDTO): Promise<void> {
    await this.ormRepository.delete({
      id,
      business_id,
    });
  }
}

export default CommandRepository;

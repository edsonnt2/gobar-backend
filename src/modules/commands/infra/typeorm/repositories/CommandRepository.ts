import { Repository, getRepository } from 'typeorm';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import ICreateCommandDTO from '@modules/commands/Dtos/ICreateCommandDTO';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import IFindByNumberCommandDTO from '@modules/commands/Dtos/IFIndByNumberCommandDTO';
import IFindByCustomerCommandDTO from '@modules/commands/Dtos/IFIndByCustomerCommandDTO';
import IDeleteByIdCommandDTO from '@modules/commands/Dtos/IDeleteByIdCommandDTO';
import ISearchCommandDTO from '@modules/commands/Dtos/ISearchCommandDTO';
import removeAccents from '@shared/utils/removeAccents';

class CommandRepository implements ICommandRepository {
  private ormRepository: Repository<Command>;

  constructor() {
    this.ormRepository = getRepository(Command);
  }

  public async create({
    business_id,
    customer_id,
    number,
    value_ingress,
    ingress_consume,
    prepaid_ingress,
    value_consume,
  }: ICreateCommandDTO): Promise<Command> {
    const command = this.ormRepository.create({
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
  }: IFindByNumberCommandDTO): Promise<Command | undefined> {
    const command = await this.ormRepository.findOne({
      number,
      business_id,
    });

    return command;
  }

  public async getAll(business_id: string): Promise<Command[]> {
    const command = await this.ormRepository.find({
      relations: ['customer'],
      where: {
        business_id,
      },
    });

    return command;
  }

  public async findById(id: string): Promise<Command | undefined> {
    const command = this.ormRepository.findOne({ id });

    return command;
  }

  public async findByCustomer({
    customer_id,
    business_id,
  }: IFindByCustomerCommandDTO): Promise<Command | undefined> {
    const command = this.ormRepository.findOne({ customer_id, business_id });

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
    const newSearch = removeAccents(search).toLowerCase().trim();

    const queryNumber =
      isNumber !== ''
        ? `c.number LIKE '%${isNumber}%' OR cu.cell_phone LIKE '%${isNumber}%' OR cu.cpf_or_cnpj LIKE '%${isNumber}%' OR `
        : '';

    const commandOne = await this.ormRepository.query(
      `SELECT c.id FROM commands AS c INNER JOIN customers AS cu ON c.customer_id = cu.id
      WHERE (${queryNumber}cu.label_name LIKE '%${newSearch}%' OR cu.email LIKE '%${newSearch}%')
      AND c.business_id = $1 LIMIT 20`,
      [business_id],
    );

    const notIdCommand: string[] = commandOne.map(
      ({ id }: { id: string }) => ` AND c.id != '${id}'`,
    );

    const searchSql: string[] = [];
    newSearch.split(' ').forEach(searchSeparator => {
      const isNumberSeparator = searchSeparator
        .split('')
        .filter(char => Number(char) || char === '0')
        .join('');

      const queryNumberSeparator =
        isNumber !== ''
          ? `c.number LIKE '%${isNumberSeparator}%' OR cu.cell_phone LIKE '%${isNumberSeparator}%' OR
          cu.cpf_or_cnpj LIKE '%${isNumberSeparator}%' OR `
          : '';

      searchSql.push(
        `(${queryNumberSeparator}cu.label_name LIKE '%${searchSeparator}%' OR cu.email LIKE '%${searchSeparator}%')`,
      );
    });

    const commandTwo =
      commandOne.length < 20
        ? await this.ormRepository.query(
            `SELECT c.id FROM commands AS c INNER JOIN customers AS cu ON c.customer_id = cu.id
            WHERE ${searchSql.join(
              ' AND ',
            )} AND c.business_id = $1${notIdCommand.join('')} LIMIT ${
              20 - commandOne.length
            }`,
            [business_id],
          )
        : [];

    const commandIds = commandOne.concat(commandTwo);

    const commands =
      commandIds.length > 0
        ? await this.ormRepository.find({
            relations: ['customer'],
            where: commandIds,
          })
        : [];

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

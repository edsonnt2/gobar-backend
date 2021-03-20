import { Repository, getRepository, IsNull, Not, ObjectLiteral } from 'typeorm';

import removeAccents from '@shared/utils/removeAccents';
import ITableRepository from '@modules/tables/repositories/ITableRepository';
import ICreateTableDTO from '@modules/tables/Dtos/ICreateTableDTO';
import IFindByNumberTableDTO from '@modules/tables/Dtos/IFindByNumberTableDTO';
import IAllTableDTO from '@modules/tables/Dtos/IAllTableDTO';
import IFindByIdsTableDTO from '@modules/tables/Dtos/IFindByIdsTableDTO';
import IFindByCustomerTableDTO from '@modules/tables/Dtos/IFindByCustomerTableDTO';
import IFindByIdTableDTO from '@modules/tables/Dtos/IFindByIdTableDTO';
import ISearchTableDTO from '@modules/tables/Dtos/ISearchTableDTO';
import IDeleteByIdTableDTO from '@modules/tables/Dtos/IDeleteByIdTableDTO';
import IRemoveCustomerTableDTO from '@modules/tables/Dtos/IRemoveCustomerTableDTO';
import Table from '../entities/Table';
import TableCustomer from '../entities/TableCustomer';

class TableRepository implements ITableRepository {
  private ormRepository: Repository<Table>;

  private ormTableCustomer: Repository<TableCustomer>;

  constructor() {
    this.ormRepository = getRepository(Table);
    this.ormTableCustomer = getRepository(TableCustomer);
  }

  public async create({
    operator_id,
    business_id,
    customer_id,
    number,
  }: ICreateTableDTO): Promise<Table> {
    const table = this.ormRepository.create({
      business_id,
      operator_id,
      number,
      ...(customer_id && {
        table_customer: [
          {
            customer_id,
          },
        ],
      }),
    });

    await this.ormRepository.save(table);

    return table;
  }

  public async findByNumber({
    number,
    business_id,
    closed,
  }: IFindByNumberTableDTO): Promise<Table | undefined> {
    const hasClosed = closed
      ? 'AND table.table_closure_id IS NOT NULL'
      : 'AND table.table_closure_id IS NULL';

    const table = await this.ormRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.table_product', 'table_product')
      .leftJoinAndSelect('table_product.operator', 'operator')
      .leftJoinAndSelect('table_product.product', 'product')
      .leftJoinAndSelect('table.table_customer', 'table_customer')
      .leftJoinAndSelect('table_customer.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'table',
        'table_product',
        'table_customer',
        'product.image',
        'operator.name',
        'operator.avatar',
        'customer.id',
        'customer.name',
        'user.avatar',
      ])
      .where(`table.number=:number AND table.business_id=:bid ${hasClosed}`, {
        number,
        bid: business_id,
      })
      .orderBy({
        'table_product.id': 'DESC',
      })
      .getOne();

    return table;
  }

  public async getAll({ business_id, closed }: IAllTableDTO): Promise<Table[]> {
    const hasClosed = closed
      ? 'AND table.table_closure_id IS NOT NULL'
      : 'AND table.table_closure_id IS NULL';

    const tables = await this.ormRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.table_product', 'table_product')
      .leftJoinAndSelect('table_product.operator', 'operator')
      .leftJoinAndSelect('table_product.product', 'product')
      .leftJoinAndSelect('table.table_customer', 'table_customer')
      .leftJoinAndSelect('table_customer.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'table',
        'table_product',
        'table_customer.id',
        'table_customer.customer_id',
        'product.image',
        'operator.name',
        'operator.avatar',
        'customer.name',
        'user.avatar',
      ])
      .where(`table.business_id=:bid ${hasClosed}`, { bid: business_id })
      .orderBy({
        'table_product.id': 'DESC',
      })
      .getMany();

    return tables;
  }

  public async findById({
    id,
    closed,
  }: IFindByIdTableDTO): Promise<Table | undefined> {
    const hasClosed = closed ? Not(IsNull()) : IsNull();

    const table = await this.ormRepository.findOne({
      relations: ['table_customer'],
      where: {
        id,
        table_closure_id: hasClosed,
      },
    });

    return table;
  }

  public async findByIds({
    ids,
    business_id,
    closed,
  }: IFindByIdsTableDTO): Promise<Table[]> {
    const hasClosed = closed ? Not(IsNull()) : IsNull();

    const tables = await this.ormRepository.findByIds(ids, {
      where: {
        business_id,
        table_closure_id: hasClosed,
      },
    });

    return tables;
  }

  public async findByCustomer({
    customer_id,
    business_id,
    closed,
  }: IFindByCustomerTableDTO): Promise<Table | undefined> {
    const hasClosed = closed
      ? 'AND table.table_closure_id IS NOT NULL'
      : 'AND table.table_closure_id IS NULL';

    const table = await this.ormRepository
      .createQueryBuilder('table')
      .innerJoinAndSelect('table.table_customer', 'table_customer')
      .leftJoinAndSelect('table.table_product', 'table_product')
      .leftJoinAndSelect('table_product.operator', 'operator')
      .leftJoinAndSelect('table_product.product', 'product')
      .leftJoinAndSelect('table_customer.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'table',
        'table_product',
        'product.image',
        'operator.name',
        'operator.avatar',
        'customer.name',
        'user.avatar',
      ])
      .where(
        `table_customer.customer_id=:cid AND table.business_id=:bid ${hasClosed}`,
        {
          cid: customer_id,
          bid: business_id,
        },
      )
      .orderBy({
        'table_product.id': 'DESC',
      })
      .getOne();

    return table;
  }

  public async search({
    search,
    business_id,
    closed,
  }: ISearchTableDTO): Promise<Table[]> {
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
          ? `table.number LIKE :number${String(
              index,
            )} OR customer.cell_phone LIKE :number${String(index)} OR
          customer.taxId LIKE :number${String(index)} OR `
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
      ? 'AND table.table_closure_id IS NOT NULL'
      : 'AND table.table_closure_id IS NULL';

    parameters = {
      ...parameters,
      bid: business_id,
    };

    const tables = await this.ormRepository
      .createQueryBuilder('table')
      .innerJoinAndSelect('table.table_customer', 'table_customer')
      .innerJoinAndSelect('table_customer.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'table.id',
        'table.number',
        'table.table_closure_id',
        'table_customer',
        'customer.id',
        'customer.name',
        'user.avatar',
      ])
      .where(
        `${searchSql.join(' AND ')} AND table.business_id=:bid ${hasClosed}`,
        parameters,
      )
      .limit(20)
      .getMany();

    return tables;
  }

  public async deleteById({
    id,
    business_id,
  }: IDeleteByIdTableDTO): Promise<void> {
    await this.ormRepository.delete({
      id,
      business_id,
    });
  }

  public async removeCustomer({
    table_id,
    customer_id,
  }: IRemoveCustomerTableDTO): Promise<void> {
    await this.ormTableCustomer.delete({
      customer_id,
      table_id,
    });
  }

  public async save(table: Table): Promise<void> {
    await this.ormRepository.save(table);
  }
}

export default TableRepository;

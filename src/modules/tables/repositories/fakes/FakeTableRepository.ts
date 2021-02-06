import crypto from 'crypto';

import Table from '@modules/tables/infra/typeorm/entities/Table';
import ICreateTableDTO from '@modules/tables/Dtos/ICreateTableDTO';
import IFindByNumberTableDTO from '@modules/tables/Dtos/IFindByNumberTableDTO';
import IAllTableDTO from '@modules/tables/Dtos/IAllTableDTO';
import IFindByIdTableDTO from '@modules/tables/Dtos/IFindByIdTableDTO';
import IFindByIdsTableDTO from '@modules/tables/Dtos/IFindByIdsTableDTO';
import IFindByCustomerTableDTO from '@modules/tables/Dtos/IFindByCustomerTableDTO';
import ISearchTableDTO from '@modules/tables/Dtos/ISearchTableDTO';
import IDeleteByIdTableDTO from '@modules/tables/Dtos/IDeleteByIdTableDTO';
import IRemoveCustomerTableDTO from '@modules/tables/Dtos/IRemoveCustomerTableDTO';
import ITableRepository from '../ITableRepository';

class FakeTableRepository implements ITableRepository {
  private tables: Table[] = [];

  public async create({
    customer_id,
    ...data
  }: ICreateTableDTO): Promise<Table> {
    const table = new Table();

    const idTable = crypto.randomBytes(6).toString('hex');

    Object.assign(
      table,
      {
        id: idTable,
        ...(customer_id && {
          table_customer: [
            {
              table_id: idTable,
              customer_id,
            },
          ],
        }),
      },
      data,
    );

    this.tables.push(table);

    return table;
  }

  public async findByNumber({
    number,
    business_id,
    closed,
  }: IFindByNumberTableDTO): Promise<Table | undefined> {
    const table = this.tables.find(findTable => {
      const openOrClose = closed
        ? !!findTable.table_closure_id
        : !findTable.table_closure_id;
      return (
        findTable.number === number &&
        findTable.business_id === business_id &&
        openOrClose
      );
    });

    return table;
  }

  public async getAll({ business_id, closed }: IAllTableDTO): Promise<Table[]> {
    const table = this.tables.filter(filTable => {
      const openOrClose = closed
        ? !!filTable.table_closure_id
        : !filTable.table_closure_id;
      return filTable.business_id === business_id && openOrClose;
    });

    return table;
  }

  public async findById({
    id,
    closed,
  }: IFindByIdTableDTO): Promise<Table | undefined> {
    const table = this.tables.find(findTable => {
      const openOrClose = closed
        ? !!findTable.table_closure_id
        : !findTable.table_closure_id;
      return findTable.id === id && openOrClose;
    });

    return table;
  }

  public async findByIds({
    ids,
    business_id,
    closed,
  }: IFindByIdsTableDTO): Promise<Table[]> {
    const table = this.tables.filter(filterTable => {
      const openOrClose = closed
        ? !!filterTable.table_closure_id
        : !filterTable.table_closure_id;
      return (
        ids.some(id => id === filterTable.id) &&
        filterTable.business_id === business_id &&
        openOrClose
      );
    });

    return table;
  }

  public async findByCustomer({
    customer_id,
    business_id,
    closed,
  }: IFindByCustomerTableDTO): Promise<Table | undefined> {
    const table = this.tables.find(findTable => {
      const openOrClose = closed
        ? !!findTable.table_closure_id
        : !findTable.table_closure_id;
      return (
        findTable.table_customer.some(
          getCustomer => getCustomer.customer_id === customer_id,
        ) &&
        findTable.business_id === business_id &&
        openOrClose
      );
    });

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

    const findTables = this.tables.filter(table => {
      const openOrClose = closed
        ? !!table.table_closure_id
        : !table.table_closure_id;
      return (
        String(table.number).includes(isNumber) &&
        table.business_id === business_id &&
        openOrClose
      );
    });

    return findTables;
  }

  public async removeCustomer({
    table_id,
    customer_id,
  }: IRemoveCustomerTableDTO): Promise<void> {
    const findIndexTable = this.tables.findIndex(({ id }) => id === table_id);
    if (findIndexTable > -1) {
      const findIndexCustomer = this.tables[
        findIndexTable
      ].table_customer.findIndex(
        findIndex => findIndex.customer_id === customer_id,
      );

      if (findIndexCustomer > -1) {
        delete this.tables[findIndexTable].table_customer[findIndexCustomer];
      }
    }
  }

  public async deleteById({
    id,
    business_id,
  }: IDeleteByIdTableDTO): Promise<void> {
    const findIndex = this.tables.findIndex(
      findTable => findTable.id === id && findTable.business_id === business_id,
    );

    delete this.tables[findIndex];
  }

  public async save(table: Table): Promise<void> {
    const findIndex = this.tables.findIndex(({ id }) => id === table.id);

    this.tables[findIndex] = table;
  }
}

export default FakeTableRepository;

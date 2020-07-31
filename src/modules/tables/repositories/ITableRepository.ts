import Table from '../infra/typeorm/entities/Table';
import ICreateTableDTO from '../Dtos/ICreateTableDTO';
import IFindByNumberTableDTO from '../Dtos/IFindByNumberTableDTO';
import IAllTableDTO from '../Dtos/IAllTableDTO';
import ISearchTableDTO from '../Dtos/ISearchTableDTO';
import IFindByIdTableDTO from '../Dtos/IFindByIdTableDTO';
import IFindByIdsTableDTO from '../Dtos/IFindByIdsTableDTO';
import IFindByCustomerTableDTO from '../Dtos/IFindByCustomerTableDTO';
import IDeleteByIdTableDTO from '../Dtos/IDeleteByIdTableDTO';

export default interface ITableRepository {
  create({
    operator_id,
    business_id,
    customer_id,
    number,
  }: ICreateTableDTO): Promise<Table>;
  findByNumber({
    number,
    business_id,
    closed,
  }: IFindByNumberTableDTO): Promise<Table | undefined>;
  getAll({ business_id, closed }: IAllTableDTO): Promise<Table[]>;
  search({ business_id, search, closed }: ISearchTableDTO): Promise<Table[]>;
  findById({ id, closed }: IFindByIdTableDTO): Promise<Table | undefined>;
  findByIds({ ids, business_id, closed }: IFindByIdsTableDTO): Promise<Table[]>;
  findByCustomer({
    customer_id,
    business_id,
    closed,
  }: IFindByCustomerTableDTO): Promise<Table | undefined>;
  // removeCustomer({
  //   table_id,
  //   customer_id,
  // }: IRemoveCustomerTableDTO): Promise<Table | undefined>;
  deleteById({ id, business_id }: IDeleteByIdTableDTO): Promise<void>;
  save(table: Table): Promise<void>;
}

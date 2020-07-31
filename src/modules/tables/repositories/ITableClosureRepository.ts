import ICreateTableClosureDTO from '../Dtos/ICreateTableClosureDTO';
import TableClosure from '../infra/typeorm/entities/TableClosure';

export default interface ITableClosureRepository {
  create({
    operator_id,
    business_id,
    value_total,
    discount,
    payment_tables_closure,
    table_ids,
  }: ICreateTableClosureDTO): Promise<TableClosure>;
}

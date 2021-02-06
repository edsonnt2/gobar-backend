import { Repository, getRepository } from 'typeorm';
import ITableClosureRepository from '@modules/tables/repositories/ITableClosureRepository';
import ICreateTableClosureDTO from '@modules/tables/Dtos/ICreateTableClosureDTO';
import TableClosure from '../entities/TableClosure';

class TableClosureRepository implements ITableClosureRepository {
  private ormRepository: Repository<TableClosure>;

  constructor() {
    this.ormRepository = getRepository(TableClosure);
  }

  public async create({
    operator_id,
    business_id,
    value_total,
    discount,
    payment_tables_closure,
    table_ids,
  }: ICreateTableClosureDTO): Promise<TableClosure> {
    const idsTables = table_ids.map(ids => ({
      id: ids,
    }));

    const tableClosure = this.ormRepository.create({
      business_id,
      operator_id,
      discount,
      value_total,
      payment_closure_or_discount: payment_tables_closure,
      table: idsTables,
    });

    await this.ormRepository.save(tableClosure);

    return tableClosure;
  }
}

export default TableClosureRepository;

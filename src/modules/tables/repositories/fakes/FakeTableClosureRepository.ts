import crypto from 'crypto';
import TableClosure from '@modules/tables/infra/typeorm/entities/TableClosure';
import ICreateTableClosureDTO from '@modules/tables/Dtos/ICreateTableClosureDTO';
import ITableClosureRepository from '../ITableClosureRepository';

class FakeTableClosureRepository implements ITableClosureRepository {
  private tablesClosure: TableClosure[] = [];

  public async create(data: ICreateTableClosureDTO): Promise<TableClosure> {
    const tableClosure = new TableClosure();

    const idTableClosure = crypto.randomBytes(6).toString('hex');

    Object.assign(tableClosure, { id: idTableClosure }, data);

    this.tablesClosure.push(tableClosure);

    return tableClosure;
  }
}

export default FakeTableClosureRepository;

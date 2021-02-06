import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ITableClosureRepository from '../repositories/ITableClosureRepository';
import ITableRepository from '../repositories/ITableRepository';
import TableClosure from '../infra/typeorm/entities/TableClosure';

interface IRequest {
  user_id: string;
  business_id: string;
  value_total: number;
  discount?: number;
  payment_tables_closure: {
    type: 'card' | 'money';
    subtotal: number;
    received?: number;
    type_card?: string;
  }[];
  table_ids: string[];
}

@injectable()
class CreateTableService {
  constructor(
    @inject('TableClosureRepository')
    private tableClosureRepository: ITableClosureRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('TableRepository')
    private tableRepository: ITableRepository,
  ) {}

  public async execute({
    user_id,
    business_id,
    value_total,
    discount,
    payment_tables_closure,
    table_ids,
  }: IRequest): Promise<TableClosure> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const tables = await this.tableRepository.findByIds({
      ids: table_ids,
      business_id,
    });

    if (tables.length !== table_ids.length)
      throw new AppError('One of the table was not found in the business');

    payment_tables_closure.forEach(payClosure => {
      if (payClosure.type === 'money' && !payClosure.received) {
        throw new AppError('Type Money requires value received');
      }

      if (payClosure.type === 'card' && !payClosure.type_card) {
        throw new AppError('Type Card requires selected of card');
      }
    });

    const tableClosure = await this.tableClosureRepository.create({
      operator_id: user_id,
      business_id,
      table_ids,
      discount,
      value_total,
      payment_tables_closure,
    });

    return tableClosure;
  }
}

export default CreateTableService;

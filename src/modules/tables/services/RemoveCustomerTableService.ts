import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ITableRepository from '../repositories/ITableRepository';
import Table from '../infra/typeorm/entities/Table';

interface IRequest {
  business_id: string;
  customer_id: string;
  table_id: string;
}

@injectable()
class RemoveCustomerTableService {
  constructor(
    @inject('TableRepository')
    private tableRepository: ITableRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    table_id,
    customer_id,
  }: IRequest): Promise<Table> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const table = await this.tableRepository.findById({
      id: table_id,
    });

    if (!table) {
      throw new AppError('Table not found');
    }

    if (table.business_id !== business_id) {
      throw new AppError('Table not found at the Business');
    }

    const findCustomerTable = table.table_customer.find(
      findCustomer => findCustomer.customer_id === customer_id,
    );

    if (!findCustomerTable) {
      throw new AppError('Customer not found at the Business');
    }

    table.table_customer = table.table_customer.filter(
      filterCustomer => filterCustomer.customer_id !== customer_id,
    );

    await this.tableRepository.removeCustomer({
      table_id,
      customer_id,
    });

    return table;
  }
}

export default RemoveCustomerTableService;

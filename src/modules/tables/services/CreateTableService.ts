import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository';
import ITableRepository from '../repositories/ITableRepository';
import Table from '../infra/typeorm/entities/Table';
import TableCustomer from '../infra/typeorm/entities/TableCustomer';

interface IRequest {
  user_id: string;
  business_id: string;
  customer_id?: string;
  number: number;
}

@injectable()
class CreateTableService {
  constructor(
    @inject('TableRepository')
    private tableRepository: ITableRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    user_id,
    business_id,
    customer_id,
    number,
  }: IRequest): Promise<Table> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    if (customer_id) {
      const customer = await this.customerRepository.findById(customer_id);

      if (!customer) throw new AppError('Customer not found');

      const customerInBusiness = customer.business_customer.filter(
        filBusiness => filBusiness.business_id === business_id,
      );

      if (customerInBusiness.length === 0)
        throw new AppError('Customer not found at this business');

      const customerHasTable = await this.tableRepository.findByCustomer({
        customer_id,
        business_id,
      });

      if (customerHasTable)
        throw new AppError('Customer already opened table at this business');
    }

    const hasTableWithNumber = await this.tableRepository.findByNumber({
      number,
      business_id,
    });

    if (hasTableWithNumber) {
      if (!customer_id) {
        throw new AppError('Table number already registered');
      }

      hasTableWithNumber.table_customer = [
        ...hasTableWithNumber.table_customer,
        {
          table_id: hasTableWithNumber.id,
          customer_id,
        },
      ] as TableCustomer[];

      await this.tableRepository.save(hasTableWithNumber);

      return hasTableWithNumber;
    }

    const table = await this.tableRepository.create({
      business_id,
      operator_id: user_id,
      customer_id,
      number,
    });

    return table;
  }
}

export default CreateTableService;

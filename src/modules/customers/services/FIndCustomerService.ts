import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICustomerRepository from '../repositories/ICustomerRepository';

interface IRequest {
  business_id: string;
  customer_id: string;
}

@injectable()
class FindCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    customer_id,
  }: IRequest): Promise<Customer> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const customer = await this.customerRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found');

    const hasInBusiness = customer.business_customer.find(
      findInCustomer => findInCustomer.business_id === business_id,
    );

    if (!hasInBusiness) {
      delete customer.cpf_or_cnpj;
    }

    return customer;
  }
}

export default FindCustomerService;

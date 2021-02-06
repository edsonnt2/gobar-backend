import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICustomerRepository from '../repositories/ICustomerRepository';
import { IReturnSearchCustomerDTO } from '../Dtos/IReturnSearchCustomerDTO';

interface IRequest {
  business_id: string;
  search: string;
}

@injectable()
class SearchCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    search,
  }: IRequest): Promise<IReturnSearchCustomerDTO> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const customers = await this.customerRepository.search(business_id, search);

    return customers;
  }
}

export default SearchCustomerService;

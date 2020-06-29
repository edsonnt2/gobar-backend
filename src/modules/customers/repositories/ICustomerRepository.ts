import ICreateCustomerDTO from '../Dtos/ICreateCustomerDTO';
import Customer from '../infra/typeorm/entities/Customer';
import IFindInCustomerDTO from '../Dtos/IFindInCustomerDTO';
import { IReturnSearchCustomerDTO } from '../Dtos/IReturnSearchCustomerDTO';

export default interface ICustomerRepository {
  create(data: ICreateCustomerDTO): Promise<Customer>;
  findInCustomer({
    find,
    where,
  }: IFindInCustomerDTO): Promise<Customer | undefined>;
  findById(id: string): Promise<Customer | undefined>;
  search(
    search: string,
    business_id: string,
  ): Promise<IReturnSearchCustomerDTO>;
  save(customer: Customer): Promise<void>;
}

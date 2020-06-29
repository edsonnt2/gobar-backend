import User from '@modules/users/infra/typeorm/entities/User';
import Customer from '../infra/typeorm/entities/Customer';

export interface IReturnSearchCustomerDTO {
  customersInBusiness: Customer[];
  customersOutherBusiness: Customer[];
  users: User[];
}

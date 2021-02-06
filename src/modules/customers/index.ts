import { container } from 'tsyringe';

import CustomerRepository from '@modules/customers/infra/typeorm/repositories/CustomerRepository';
import ICustomerRepository from './repositories/ICustomerRepository';

container.registerSingleton<ICustomerRepository>(
  'CustomerRepository',
  CustomerRepository,
);

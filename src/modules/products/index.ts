import { container } from 'tsyringe';

import IProductRepository from './repositories/IProductRepository';
import ProductRepository from './infra/typeorm/repositories/ProductRepository';

container.registerSingleton<IProductRepository>(
  'ProductRepository',
  ProductRepository,
);

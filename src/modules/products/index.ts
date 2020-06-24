import { container } from 'tsyringe';

import IProductRepository from './repositories/IProductRepository';
import ProductRepository from './infra/typeorm/repositories/ProductRepository';

import ICategoryProductRepository from './repositories/ICategoryProductRepository';
import CategoryProductRepository from './infra/typeorm/repositories/CategoryProductRepository';

import ICategoryProviderRepository from './repositories/ICategoryProviderRepository';
import CategoryProviderRepository from './infra/typeorm/repositories/CategoryProviderRepository';

container.registerSingleton<IProductRepository>(
  'ProductRepository',
  ProductRepository,
);

container.registerSingleton<ICategoryProductRepository>(
  'CategoryProductRepository',
  CategoryProductRepository,
);

container.registerSingleton<ICategoryProviderRepository>(
  'CategoryProviderRepository',
  CategoryProviderRepository,
);

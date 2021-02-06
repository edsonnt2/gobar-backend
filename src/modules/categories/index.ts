import { container } from 'tsyringe';

import ICategoryRepository from './repositories/ICategoryRepository';
import CategoryRepository from './infra/typeorm/repositories/CategoryRepository';

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository,
);

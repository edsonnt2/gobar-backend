import { container } from 'tsyringe';

import ITableRepository from './repositories/ITableRepository';
import TableRepository from './infra/typeorm/repositories/TableRepository';
import ITableClosureRepository from './repositories/ITableClosureRepository';
import TableClosureRepository from './infra/typeorm/repositories/TableClosureRepository';

container.registerSingleton<ITableRepository>(
  'TableRepository',
  TableRepository,
);

container.registerSingleton<ITableClosureRepository>(
  'TableClosureRepository',
  TableClosureRepository,
);

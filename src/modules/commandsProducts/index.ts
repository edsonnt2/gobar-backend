import { container } from 'tsyringe';

import ICommandProductRepository from './repositories/ICommandProductRepository';
import CommandProductRepository from './infra/typeorm/repositories/CommandProductRepository';

container.registerSingleton<ICommandProductRepository>(
  'CommandProductRepository',
  CommandProductRepository,
);

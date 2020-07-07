import { container } from 'tsyringe';

import ICommandRepository from './repositories/ICommandRepository';
import CommandRepository from './infra/typeorm/repositories/CommandRepository';

container.registerSingleton<ICommandRepository>(
  'CommandRepository',
  CommandRepository,
);

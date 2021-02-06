import { container } from 'tsyringe';

import ICommandRepository from './repositories/ICommandRepository';
import CommandRepository from './infra/typeorm/repositories/CommandRepository';
import ICommandClosureRepository from './repositories/ICommandClosureRepository';
import CommandClosureRepository from './infra/typeorm/repositories/CommandClosureRepository';

container.registerSingleton<ICommandRepository>(
  'CommandRepository',
  CommandRepository,
);

container.registerSingleton<ICommandClosureRepository>(
  'CommandClosureRepository',
  CommandClosureRepository,
);

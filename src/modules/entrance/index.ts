import { container } from 'tsyringe';

import IEntranceRepository from './repositories/IEntranceRepository';
import EntranceRepository from './infra/typeorm/repositories/EntranceRepository';

container.registerSingleton<IEntranceRepository>(
  'EntranceRepository',
  EntranceRepository,
);

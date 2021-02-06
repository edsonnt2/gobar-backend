import { container } from 'tsyringe';

import IBusinessRepository from './repositories/IBusinessRepository';
import BusinessRepository from './infra/typeorm/repositories/BusinessRepository';

container.registerSingleton<IBusinessRepository>(
  'BusinessRepository',
  BusinessRepository,
);

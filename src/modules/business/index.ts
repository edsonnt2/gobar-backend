import { container } from 'tsyringe';

import IBusinessRepository from './repositories/IBusinessRepository';
import BusinessRepository from './infra/typeorm/repositories/BusinessRepository';

import './provider';

container.registerSingleton<IBusinessRepository>(
  'BusinessRepository',
  BusinessRepository,
);

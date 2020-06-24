import { container } from 'tsyringe';

import IIngressRepository from './repositories/IIngressRepository';
import IngressRepository from './infra/typeorm/repositories/IngressRepository';

container.registerSingleton<IIngressRepository>(
  'IngressRepository',
  IngressRepository,
);

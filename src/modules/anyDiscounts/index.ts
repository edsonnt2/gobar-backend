import { container } from 'tsyringe';
import IAnyDiscountRepository from './repositories/IAnyDiscountRepository';
import AnyDiscountRepository from './infra/typeorm/repositories/AnyDiscountRepository';

container.registerSingleton<IAnyDiscountRepository>(
  'AnyDiscountRepository',
  AnyDiscountRepository,
);

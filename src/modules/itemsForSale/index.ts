import { container } from 'tsyringe';

import IIemForSaleRepository from './repositories/IItemForSaleRepository';
import ItemForSaleRepository from './infra/typeorm/repositories/ItemForSaleRepository';

container.registerSingleton<IIemForSaleRepository>(
  'ItemForSaleRepository',
  ItemForSaleRepository,
);

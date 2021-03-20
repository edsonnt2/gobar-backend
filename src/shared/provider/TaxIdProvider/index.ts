import { container } from 'tsyringe';
import ITaxIdProvider from './models/ITaxIdProvider';
import TaxIdProvider from './implementations/TaxIdProvider';

container.registerSingleton<ITaxIdProvider>('TaxIdProvider', TaxIdProvider);

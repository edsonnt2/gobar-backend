import { container } from 'tsyringe';
import IHashProvider from './models/IHashProvider';
import BcryptProvider from './implementations/BcryptProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptProvider);

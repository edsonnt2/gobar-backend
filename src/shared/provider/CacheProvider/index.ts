import { container } from 'tsyringe';
import IAuthProvider from './models/ICacheProvider';
import CacheProvider from './implementations/RedisProvider';

container.registerSingleton<IAuthProvider>('CacheProvider', CacheProvider);

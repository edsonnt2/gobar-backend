import { container } from 'tsyringe';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import IUserRepository from './repositories/IUserRepository';

import './provider';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

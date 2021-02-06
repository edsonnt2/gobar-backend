import { container } from 'tsyringe';
import IAuthProvider from './models/IAuthProvider';
import JwtProvider from './implementations/JwtProvider';

container.registerSingleton<IAuthProvider>('AuthProvider', JwtProvider);

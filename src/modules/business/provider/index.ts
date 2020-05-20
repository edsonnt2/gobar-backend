import { container } from 'tsyringe';
import ICpfAndCnpjProvider from './models/ICpfAndCnpjProvider';
import CpfAndCnpjProvider from './implementations/CpfAndCnpjProvider';

container.registerSingleton<ICpfAndCnpjProvider>(
  'CpfAndCnpjProvider',
  CpfAndCnpjProvider,
);

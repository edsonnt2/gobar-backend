import { injectable, inject } from 'tsyringe';
import { differenceInYears, format } from 'date-fns';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';
import IHashProvider from '../provider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import ICreateUserDTO from '../Dtos/ICreateUserDTO';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    full_name,
    cell_phone,
    email,
    password,
    birthDate,
  }: ICreateUserDTO): Promise<User> {
    const isEmailRegistered = await this.userRepository.findByEmail(email);

    if (isEmailRegistered)
      throw new AppError('Email already registered in another account.');

    const iscell_phoneRegistered = await this.userRepository.findBycellPhone(
      cell_phone,
    );
    if (iscell_phoneRegistered)
      throw new AppError('Phone already registered in another account.');

    const passwordHashed = await this.hashProvider.generateHash(password);

    const parsedDate = new Date(birthDate);

    const differenceYears = differenceInYears(Date.now(), parsedDate);

    if (!differenceYears) throw new AppError('Format Date invalid.');

    if (differenceYears < 16)
      throw new AppError('Age minimum for register is 16 Years.');

    const user = await this.userRepository.create({
      full_name,
      cell_phone,
      email,
      password: passwordHashed,
      birthDate: format(parsedDate, 'yyyy/MM/dd'),
    });

    return user;
  }
}

export default CreateUserService;

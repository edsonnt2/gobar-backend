import { injectable, inject } from 'tsyringe';
import { differenceInYears, format } from 'date-fns';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IHashProvider from '../provider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  name: string;
  cell_phone: string;
  email: string;
  password: string;
  birthDate: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('AuthProvider')
    private authProvider: IAuthProvider,
  ) {}

  public async execute({
    name,
    cell_phone,
    email,
    password,
    birthDate,
  }: IRequest): Promise<{ user: User; token: string }> {
    const isEmailRegistered = await this.userRepository.findByEmail(email);

    if (isEmailRegistered)
      throw new AppError('Email already registered in another account');

    const formattedToNumber = Number(
      cell_phone
        .split('')
        .filter(char => Number(char) || char === '0')
        .join(''),
    );

    const iscell_phoneRegistered = await this.userRepository.findBycellPhone(
      formattedToNumber,
    );
    if (iscell_phoneRegistered)
      throw new AppError('Phone already registered in another account');

    const passwordHashed = await this.hashProvider.generateHash(password);

    const parsedDate = new Date(birthDate);

    const differenceYears = differenceInYears(Date.now(), parsedDate);

    if (!differenceYears) throw new AppError('Format Date invalid');

    if (differenceYears < 16)
      throw new AppError('Age minimum for register is 16 Years');

    const user = await this.userRepository.create({
      name,
      cell_phone: formattedToNumber,
      email,
      password: passwordHashed,
      birthDate: format(parsedDate, 'yyyy/MM/dd'),
    });

    const token = this.authProvider.signIn({ user_id: user.id });

    return { user, token };
  }
}

export default CreateUserService;

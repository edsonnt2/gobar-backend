import { differenceInYears, format } from 'date-fns';
import User from '../typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import ICreateUserDTO from '../Dtos/ICreateUserDTO';
import IHashProvider from '../provider/models/IHashProvider';

class CreateUserService {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    full_name,
    cellPhone,
    email,
    password,
    birthDate,
  }: ICreateUserDTO): Promise<User> {
    const isEmailRegistered = await this.userRepository.findByEmail(email);

    if (isEmailRegistered)
      throw new Error('Email already registered in another account.');

    const iscellPhoneRegistered = await this.userRepository.findByCellPhone(
      cellPhone,
    );
    if (iscellPhoneRegistered)
      throw new Error('Phone already registered in another account.');

    const passwordHashed = await this.hashProvider.generateHash(password);

    const parsedDate = new Date(birthDate);

    const differenceYears = differenceInYears(Date.now(), parsedDate);

    if (!differenceYears) throw new Error('Format Date invalid.');

    if (differenceYears < 16)
      throw new Error('Age minimum for register is 16 Years.');

    const user = await this.userRepository.create({
      full_name,
      cellPhone,
      email,
      password: passwordHashed,
      birthDate: format(parsedDate, 'yyyy/MM/dd'),
    });

    return user;
  }
}

export default CreateUserService;

import { getRepository, Repository } from 'typeorm';
import ICreateUserDTO from '@modules/users/Dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import removeAccents from '@shared/utils/removeAccents';
import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    cell_phone,
    password,
    birthDate,
    gender,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      label_name: removeAccents(name).toLowerCase().trim(),
      email,
      cell_phone,
      password,
      birthDate,
      gender,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        email: email?.toLowerCase()?.trim(),
      },
    });

    return user;
  }

  public async findBycellPhone(cell_phone: number): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        cell_phone,
      },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ id });

    return user;
  }

  public async save(user: User): Promise<void> {
    await this.ormRepository.save(user);
  }
}

export default UserRepository;

import { getRepository, Repository } from 'typeorm';
import ICreateUserDTO from '@modules/users/Dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import User from '../entities/User';

class FakeUserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    full_name,
    email,
    cell_phone,
    password,
    birthDate,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      full_name,
      email,
      cell_phone,
      password,
      birthDate,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  public async findBycellPhone(cell_phone: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        cell_phone,
      },
    });

    return user;
  }
}

export default FakeUserRepository;

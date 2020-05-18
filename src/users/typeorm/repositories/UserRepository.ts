import { getRepository, Repository } from 'typeorm';
import IUserRepository from '../../repositories/IUserRepository';
import ICreateUserDTO from '../../Dtos/ICreateUserDTO';
import User from '../entities/User';

class FakeUserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    full_name,
    email,
    cellPhone,
    password,
    birthDate,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      full_name,
      email,
      cellPhone,
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

  public async findByCellPhone(cellPhone: number): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        cellPhone,
      },
    });

    return user;
  }
}

export default FakeUserRepository;

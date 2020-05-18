import IUserRepository from '../IUserRepository';
import ICreateUserDTO from '../../Dtos/ICreateUserDTO';
import User from '../../typeorm/entities/User';

class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: '123456' }, data);

    this.users.push(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.email === email);

    return user;
  }

  public async findByCellPhone(cellPhone: number): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.cellPhone === cellPhone);

    return user;
  }
}

export default FakeUserRepository;

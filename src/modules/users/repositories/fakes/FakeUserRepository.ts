import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/Dtos/ICreateUserDTO';
import IUserRepository from '../IUserRepository';

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

  public async findBycellPhone(cell_phone: number): Promise<User | undefined> {
    const user = this.users.find(
      findUser => findUser.cell_phone === cell_phone,
    );

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.id === id);

    return user;
  }

  public async save(user: User): Promise<void> {
    const findIndex = this.users.findIndex(({ id }) => id === user.id);

    this.users[findIndex] = user;
  }
}

export default FakeUserRepository;

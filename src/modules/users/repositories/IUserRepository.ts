import ICreateUserDTO from '../Dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findBycellPhone(cell_phone: string): Promise<User | undefined>;
}
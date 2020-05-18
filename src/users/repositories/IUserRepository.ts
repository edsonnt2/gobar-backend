import User from '../typeorm/entities/User';
import ICreateUserDTO from '../Dtos/ICreateUserDTO';

export default interface IUserRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByCellPhone(cellPhone: number): Promise<User | undefined>;
}

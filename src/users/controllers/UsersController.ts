import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';

import UserRepository from '../typeorm/repositories/UserRepository';
import BcryptProvider from '../provider/implementations/BcryptProvider';

export default class UsersControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { full_name, email, cellPhone, password, birthDate } = req.body;
    const userRepository = new UserRepository();
    const bcryptProvider = new BcryptProvider();
    const createUserService = new CreateUserService(
      userRepository,
      bcryptProvider,
    );

    const user = await createUserService.execute({
      full_name,
      email,
      cellPhone,
      password,
      birthDate,
    });
    return res.json(user);
  }
}

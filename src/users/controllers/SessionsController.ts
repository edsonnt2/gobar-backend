import { Request, Response } from 'express';
import AuthenticationUserService from '../services/AuthenticationUserService';

import UserRepository from '../typeorm/repositories/UserRepository';
import BcryptProvider from '../provider/implementations/BcryptProvider';
import JwtProvider from '../provider/implementations/JwtProvider';

export default class UsersControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cellPhoneOrEmail, password } = req.body;
    const userRepository = new UserRepository();
    const bcryptProvider = new BcryptProvider();
    const jwtProvider = new JwtProvider();
    const authenticationUserService = new AuthenticationUserService(
      userRepository,
      bcryptProvider,
      jwtProvider,
    );

    const { user, token } = await authenticationUserService.execute({
      cellPhoneOrEmail,
      password,
    });
    return res.json({ user, token });
  }
}

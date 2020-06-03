import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticationUserService from '@modules/users/services/AuthenticationUserService';
import { classToClass } from 'class-transformer';

export default class SessionsControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cellPhoneOrEmail, password } = req.body;

    const authenticationUserService = container.resolve(
      AuthenticationUserService,
    );

    const { user, token } = await authenticationUserService.execute({
      cellPhoneOrEmail,
      password,
    });
    return res.json({ user: classToClass(user), token });
  }
}

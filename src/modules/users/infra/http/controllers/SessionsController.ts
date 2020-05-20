import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticationUserService from '@modules/users/services/AuthenticationUserService';

export default class UsersControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cellPhoneOrEmail, password } = req.body;

    const authenticationUserService = container.resolve(
      AuthenticationUserService,
    );

    const { user, token } = await authenticationUserService.execute({
      cellPhoneOrEmail,
      password,
    });
    return res.json({ user, token });
  }
}

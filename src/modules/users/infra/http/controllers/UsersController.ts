import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import { classToClass } from 'class-transformer';

export default class UsersControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { full_name, email, cell_phone, password, birthDate } = req.body;

    const createUserService = container.resolve(CreateUserService);

    const { user, token } = await createUserService.execute({
      full_name,
      email,
      cell_phone,
      password,
      birthDate,
    });
    return res.json({ user: classToClass(user), token });
  }
}

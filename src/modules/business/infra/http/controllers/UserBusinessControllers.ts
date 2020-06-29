import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListBusinessService from '@modules/business/services/ListBusinessService';
import { classToClass } from 'class-transformer';

export default class UserBusinessControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const listBusinessService = container.resolve(ListBusinessService);

    const business = await listBusinessService.execute({
      user_id: req.user.id,
    });

    return res.json(classToClass(business));
  }
}

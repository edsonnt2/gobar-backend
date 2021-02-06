import { Response, Request } from 'express';
import { container } from 'tsyringe';
import AuthenticationBusinessService from '@modules/business/services/AuthenticationBusinessService';
import { classToClass } from 'class-transformer';

export default class SessionsBusinessControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { business_id } = req.body;
    const authenticationBusinessService = container.resolve(
      AuthenticationBusinessService,
    );

    const { business, token } = await authenticationBusinessService.execute({
      user_id: req.user.id,
      business_id,
    });

    return res.json({ business: classToClass(business), token });
  }
}

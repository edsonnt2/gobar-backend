import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateTableBusinessService from '@modules/business/services/UpdateTableBusinessService';
import { classToClass } from 'class-transformer';

export default class AvatarBusinessControllers {
  public async update(req: Request, res: Response): Promise<Response> {
    const { table } = req.body;

    const updateTableBusinessService = container.resolve(
      UpdateTableBusinessService,
    );

    const business = await updateTableBusinessService.execute({
      user_id: req.user.id,
      business_id: req.business.id,
      table,
    });

    return res.json(classToClass(business));
  }
}

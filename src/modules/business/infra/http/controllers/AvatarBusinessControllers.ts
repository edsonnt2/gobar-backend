import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateAvatarBusinessService from '@modules/business/services/UpdateAvatarBusinessService';
import { classToClass } from 'class-transformer';

export default class AvatarBusinessControllers {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateAvatarBusinessService = container.resolve(
      UpdateAvatarBusinessService,
    );

    const business = await updateAvatarBusinessService.execute({
      user_id: req.user.id,
      business_id: req.business.id,
      avatarFilename: req.file.filename,
    });

    return res.json(classToClass(business));
  }
}

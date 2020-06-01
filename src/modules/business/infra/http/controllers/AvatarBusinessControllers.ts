import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateAvatarBusinessService from '@modules/business/services/UpdateAvatarBusinessService';

export default class UsersControllers {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateAvatarBusinessService = container.resolve(
      UpdateAvatarBusinessService,
    );

    const businessOrAvatar = await updateAvatarBusinessService.execute({
      user_id: req.user.id,
      business_id: req.business.id,
      avatarFilename: req.file.filename,
    });

    return res.json(businessOrAvatar);
  }
}

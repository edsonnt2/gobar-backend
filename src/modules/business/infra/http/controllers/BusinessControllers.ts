import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateBusinessService from '@modules/business/services/CreateBusinessService';
import { classToClass } from 'class-transformer';

export default class BusinessControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      taxId,
      categories,
      cell_phone,
      phone,
      zip_code,
      street,
      number,
      complement,
      city,
      district,
      state,
    } = req.body;

    const avatar = req.file ? req.file.filename : undefined;

    const createBusinessService = container.resolve(CreateBusinessService);

    const { business, token } = await createBusinessService.execute({
      user_id: req.user.id,
      avatar,
      name,
      taxId,
      categories,
      cell_phone,
      phone,
      zip_code,
      street,
      number,
      complement,
      city,
      district,
      state,
    });

    return res.json({ business: classToClass(business), token });
  }
}

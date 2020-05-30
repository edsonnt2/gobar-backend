import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateBusinessService from '@modules/business/services/CreateBusinessService';

export default class UsersControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      cpf_or_cnpj,
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

    const createBusinessService = container.resolve(CreateBusinessService);

    const { business, token } = await createBusinessService.execute({
      user_id: req.user.id,
      name,
      cpf_or_cnpj,
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

    return res.json({ business, token });
  }
}

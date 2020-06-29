import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

export default class CustomerControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      customer_id,
      name,
      cell_phone,
      email,
      cpf_or_cnpj,
      gender,
      birthDate,
    } = req.body;
    const createCustomerService = container.resolve(CreateCustomerService);

    const customersAndUsers = await createCustomerService.execute({
      business_id: req.business.id,
      customer_id,
      name,
      cell_phone,
      email,
      cpf_or_cnpj,
      gender,
      birthDate,
    });

    return res.json(classToClass(customersAndUsers));
  }
}

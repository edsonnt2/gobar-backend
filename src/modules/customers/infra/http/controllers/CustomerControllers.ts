import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import FindCustomerService from '@modules/customers/services/FIndCustomerService';

export default class CustomerControllers {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const findCustomerService = container.resolve(FindCustomerService);

    const customer = await findCustomerService.execute({
      business_id: req.business.id,
      customer_id: id,
    });

    return res.json(customer);
  }

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

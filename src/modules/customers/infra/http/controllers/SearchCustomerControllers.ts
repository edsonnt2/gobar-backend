import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import SearchCustomerService from '@modules/customers/services/SearchCustomerService';

export default class SearchCustomerControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;
    const searchCustomerService = container.resolve(SearchCustomerService);

    const customersAndUsers = await searchCustomerService.execute({
      business_id: req.business.id,
      search: String(search),
    });

    return res.json(classToClass(customersAndUsers));
  }
}

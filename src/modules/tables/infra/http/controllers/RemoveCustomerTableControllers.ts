import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RemoveCustomerTableService from '@modules/tables/services/RemoveCustomerTableService';
import { classToClass } from 'class-transformer';

export default class RemoveCustomerTableControllers {
  public async delete(req: Request, res: Response): Promise<Response> {
    const { table_id, customer_id } = req.query;

    const removeCustomerTableService = container.resolve(
      RemoveCustomerTableService,
    );

    const table = await removeCustomerTableService.execute({
      business_id: req.business.id,
      table_id: String(table_id),
      customer_id: String(customer_id),
    });

    return res.json(classToClass(table));
  }
}

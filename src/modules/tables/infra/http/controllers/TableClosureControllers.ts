import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTableClosureService from '@modules/tables/services/CreateTableClosureService';

export default class CommandClosureControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      value_total,
      discount,
      table_ids,
      payment_tables_closure,
    } = req.body;

    const createTableClosureService = container.resolve(
      CreateTableClosureService,
    );

    const tableClosure = await createTableClosureService.execute({
      business_id: req.business.id,
      user_id: req.user.id,
      value_total,
      discount,
      table_ids,
      payment_tables_closure,
    });

    return res.json(tableClosure);
  }
}

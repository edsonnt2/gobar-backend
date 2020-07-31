import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateTableService from '@modules/tables/services/CreateTableService';
import AllTableService from '@modules/tables/services/AllTableService';

export default class TableControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { customer_id, number } = req.body;

    const createTableService = container.resolve(CreateTableService);

    const table = await createTableService.execute({
      business_id: req.business.id,
      user_id: req.user.id,
      customer_id,
      number,
    });

    return res.json(table);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { closed } = req.query;

    const allTableService = container.resolve(AllTableService);

    const tables = await allTableService.execute({
      business_id: req.business.id,
      closed: closed as boolean | undefined,
    });

    return res.json(classToClass(tables));
  }
}

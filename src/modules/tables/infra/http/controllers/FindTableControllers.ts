import { Request, Response } from 'express';
import { container } from 'tsyringe';
import FindTableService from '@modules/tables/services/FindTableService';
import { classToClass } from 'class-transformer';

export default class SearchCommandControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { number, closed } = req.query;

    const findTableService = container.resolve(FindTableService);

    const table = await findTableService.execute({
      business_id: req.business.id,
      number: Number(number),
      closed: closed as boolean | undefined,
    });

    return res.json(classToClass(table));
  }
}

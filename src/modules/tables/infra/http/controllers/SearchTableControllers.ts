import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchTableService from '@modules/tables/services/SearchTableService';
import { classToClass } from 'class-transformer';

export default class SearchCommandControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search, closed } = req.query;

    const searchTableService = container.resolve(SearchTableService);

    const tables = await searchTableService.execute({
      business_id: req.business.id,
      search: String(search),
      closed: closed as boolean | undefined,
    });

    return res.json(classToClass(tables));
  }
}

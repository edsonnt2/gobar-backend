import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchCommandService from '@modules/commands/services/SearchCommandService';
import { classToClass } from 'class-transformer';

export default class SearchCommandControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search, closed } = req.query;

    const searchCommandService = container.resolve(SearchCommandService);

    const commands = await searchCommandService.execute({
      business_id: req.business.id,
      search: String(search),
      closed: closed as boolean | undefined,
    });

    return res.json(classToClass(commands));
  }
}

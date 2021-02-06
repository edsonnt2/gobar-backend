import { Request, Response } from 'express';
import { container } from 'tsyringe';
import FindCommandService from '@modules/commands/services/FindCommandService';
import { classToClass } from 'class-transformer';

export default class SearchCommandControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { number, closed } = req.query;

    const findCommandService = container.resolve(FindCommandService);

    const command = await findCommandService.execute({
      business_id: req.business.id,
      number: Number(number),
      closed: closed as boolean | undefined,
    });

    return res.json(classToClass(command));
  }
}

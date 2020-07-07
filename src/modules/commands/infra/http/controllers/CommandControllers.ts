import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateCommandService from '@modules/commands/services/CreateCommandService';
import AllCommandService from '@modules/commands/services/AllCommandService';

export default class CommandControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      customer_id,
      number,
      ingress_id,
      prepaid_ingress,
      value_consume,
    } = req.body;

    const createCommandService = container.resolve(CreateCommandService);

    const command = await createCommandService.execute({
      business_id: req.business.id,
      customer_id,
      number,
      ingress_id,
      prepaid_ingress,
      value_consume,
    });

    return res.json(command);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const allCommandService = container.resolve(AllCommandService);

    const commands = await allCommandService.execute({
      business_id: req.business.id,
    });

    return res.json(classToClass(commands));
  }
}

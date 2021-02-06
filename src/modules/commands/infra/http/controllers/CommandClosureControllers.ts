import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCommandClosureService from '@modules/commands/services/CreateCommandClosureService';

export default class CommandClosureControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      value_total,
      discount,
      command_ids,
      payment_commands_closure,
    } = req.body;

    const createCommandClosureService = container.resolve(
      CreateCommandClosureService,
    );

    const commandClosure = await createCommandClosureService.execute({
      business_id: req.business.id,
      user_id: req.user.id,
      value_total,
      discount,
      command_ids,
      payment_commands_closure,
    });

    return res.json(commandClosure);
  }
}

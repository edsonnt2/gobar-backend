import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCommandProductService from '@modules/commandsProducts/services/CreateCommandProductService';

export default class CommandControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { command, products } = req.body;

    const createCommandProductService = container.resolve(
      CreateCommandProductService,
    );

    const productsInCommand = await createCommandProductService.execute({
      business_id: req.business.id,
      command,
      products,
    });

    return res.json(productsInCommand);
  }
}

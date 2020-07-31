import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCommandProductService from '@modules/itemsForSale/services/CreateItemForSaleService';
import DeleteCommandProductService from '@modules/itemsForSale/services/DeleteItemForSaleService';

export default class CommandProductControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { command, products } = req.body;

    const createCommandProductService = container.resolve(
      CreateCommandProductService,
    );

    const productsInCommand = await createCommandProductService.execute({
      business_id: req.business.id,
      user_id: req.user.id,
      command,
      products,
    });

    return res.json(productsInCommand);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { command_id, command_product_id } = req.query;

    const deleteCommandProductService = container.resolve(
      DeleteCommandProductService,
    );

    await deleteCommandProductService.execute({
      business_id: req.business.id,
      command_id: String(command_id),
      item_product_id: String(command_product_id),
    });

    return res.send();
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTableProductService from '@modules/itemsForSale/services/CreateItemForSaleService';
import DeleteTableProductService from '@modules/itemsForSale/services/DeleteItemForSaleService';

export default class TableProductControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { table, products } = req.body;

    const createTableProductService = container.resolve(
      CreateTableProductService,
    );

    const productsInTable = await createTableProductService.execute({
      business_id: req.business.id,
      user_id: req.user.id,
      table,
      products,
    });

    return res.json(productsInTable);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { table_id, table_product_id } = req.query;

    const deleteTableProductService = container.resolve(
      DeleteTableProductService,
    );

    await deleteTableProductService.execute({
      business_id: req.business.id,
      table_id: String(table_id),
      item_product_id: String(table_product_id),
    });

    return res.send();
  }
}

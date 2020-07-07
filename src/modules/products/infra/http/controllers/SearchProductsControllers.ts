import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchProductService from '@modules/products/services/SearchProductService';
import FindProductService from '@modules/products/services/FindProductService';
import { classToClass } from 'class-transformer';

export default class SearchProductsControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;

    const searchProductService = container.resolve(SearchProductService);

    const products = await searchProductService.execute({
      business_id: req.business.id,
      search: String(search),
    });

    return res.json(classToClass(products));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { internal_code } = req.query;

    const findProductService = container.resolve(FindProductService);

    const products = await findProductService.execute({
      business_id: req.business.id,
      internal_code: String(internal_code),
    });

    return res.json(classToClass(products));
  }
}

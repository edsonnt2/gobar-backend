import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchCategoryProductService from '@modules/products/services/SearchCategoryProductService';

export default class CategoryProductsControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;

    const searchCategoryProductService = container.resolve(
      SearchCategoryProductService,
    );

    const CategoryProduct = await searchCategoryProductService.execute({
      user_id: req.user.id,
      search: String(search),
    });

    return res.json(CategoryProduct);
  }
}

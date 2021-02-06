import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchCategoryProviderService from '@modules/products/services/SearchCategoryProviderService';

export default class CategoryProvidersControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;

    const searchCategoryProviderService = container.resolve(
      SearchCategoryProviderService,
    );

    const CategoryProvider = await searchCategoryProviderService.execute({
      user_id: req.user.id,
      search: String(search),
    });

    return res.json(CategoryProvider);
  }
}

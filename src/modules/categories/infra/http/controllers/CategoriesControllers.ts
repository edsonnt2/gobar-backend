import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SearchCategoryService from '@modules/categories/services/SearchCategoryService';

export default class CategoryControllers {
  public async index(req: Request, res: Response): Promise<Response> {
    const { search } = req.query;
    const searchCategoryService = container.resolve(SearchCategoryService);

    const categories = await searchCategoryService.execute({
      user_id: req.user.id,
      search: search.toString(),
    });

    return res.json(categories);
  }
}

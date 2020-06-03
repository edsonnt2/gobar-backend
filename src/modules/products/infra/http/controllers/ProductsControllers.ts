import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import { classToClass } from 'class-transformer';

export default class ProductsControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      description,
      category,
      quantity,
      provider,
      internal_code,
      barcode,
      pushase_value,
      porcent,
      sale_value,
    } = req.body;

    const createProductService = container.resolve(CreateProductService);

    const product = await createProductService.execute({
      business_id: req.business.id,
      description,
      category,
      quantity,
      provider,
      internal_code,
      barcode,
      pushase_value,
      porcent,
      sale_value,
    });

    return res.json(classToClass(product));
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateImageProductService from '@modules/products/services/UpdateImageProductService';
import { classToClass } from 'class-transformer';

export default class ImageProductsControllers {
  public async update(req: Request, res: Response): Promise<Response> {
    const { product_id } = req.query;
    const updateImageProductService = container.resolve(
      UpdateImageProductService,
    );

    const productOrAvatar = await updateImageProductService.execute({
      business_id: req.business.id,
      imageFilename: req.file.filename,
      ...(product_id && { product_id: String(product_id) }),
    });

    return res.json(classToClass(productOrAvatar));
  }
}

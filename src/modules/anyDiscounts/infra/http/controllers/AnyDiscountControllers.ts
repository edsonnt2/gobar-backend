import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAnyDiscountService from '@modules/anyDiscounts/services/CreateAnyDiscountService';

export default class AnyDiscountControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { value_total, discount, command_id, payment_discount } = req.body;

    const createAnyDiscountService = container.resolve(
      CreateAnyDiscountService,
    );

    const anyDiscount = await createAnyDiscountService.execute({
      business_id: req.business.id,
      user_id: req.user.id,
      value_total,
      discount,
      command_id,
      payment_discount,
    });

    return res.json(anyDiscount);
  }
}

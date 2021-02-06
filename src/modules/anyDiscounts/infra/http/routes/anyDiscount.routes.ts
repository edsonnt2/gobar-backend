import { Router } from 'express';

import AnyDiscountControllers from '../controllers/AnyDiscountControllers';
import validatorsAnyDiscount from '../validators/anyDiscountValidators';

const AnyDiscountRouter = Router();
const anyDiscountControllers = new AnyDiscountControllers();

AnyDiscountRouter.post(
  '/',
  validatorsAnyDiscount.create,
  anyDiscountControllers.create,
);

export default AnyDiscountRouter;

import { Router } from 'express';

import CategoriesControllers from '../controllers/CategoriesControllers';
import validatorsCategory from '../validators/categoryValidators';

const categoryRouter = Router();
const categoryControllers = new CategoriesControllers();

categoryRouter.get(
  '/search',
  validatorsCategory.search,
  categoryControllers.index,
);

export default categoryRouter;

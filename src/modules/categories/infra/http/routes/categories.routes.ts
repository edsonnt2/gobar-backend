import { Router } from 'express';

import CategoriesControllers from '../controllers/CategoriesControllers';
import validatorsCategory from '../validators/categoryValidators';

const CategoryRouter = Router();
const categoryControllers = new CategoriesControllers();

CategoryRouter.get(
  '/search',
  validatorsCategory.search,
  categoryControllers.index,
);

export default CategoryRouter;

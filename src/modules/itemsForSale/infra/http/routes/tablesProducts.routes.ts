import { Router } from 'express';

import TableProductControllers from '../controllers/TableProductControllers';
import validatorsTableProduct from '../validators/tableProductValidators';

const TableProductRouter = Router();
const tableProductControllers = new TableProductControllers();

TableProductRouter.post(
  '/',
  validatorsTableProduct.create,
  tableProductControllers.create,
);

TableProductRouter.delete(
  '/',
  validatorsTableProduct.delete,
  tableProductControllers.delete,
);

export default TableProductRouter;

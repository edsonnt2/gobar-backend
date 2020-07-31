import { Router } from 'express';

import TableClosureControllers from '../controllers/TableClosureControllers';
import validatorsTableClosure from '../validators/tableClosureValidators';

const TableClosureRouter = Router();
const tableClosureControllers = new TableClosureControllers();

TableClosureRouter.post(
  '/',
  validatorsTableClosure.create,
  tableClosureControllers.create,
);

export default TableClosureRouter;

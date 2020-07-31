import { Router } from 'express';

import TableControllers from '../controllers/TableControllers';
import validatorsTable from '../validators/tableValidators';
import SearchTableControllers from '../controllers/SearchTableControllers';
import FindTableControllers from '../controllers/FindTableControllers';
import RemoveCustomerTableControllers from '../controllers/RemoveCustomerTableControllers';

const TableRouter = Router();
const tableControllers = new TableControllers();
const searchTableControllers = new SearchTableControllers();
const findTableControllers = new FindTableControllers();
const removeCustomerTableControllers = new RemoveCustomerTableControllers();

TableRouter.post('/', validatorsTable.create, tableControllers.create);
TableRouter.get('/', validatorsTable.index, tableControllers.index);
TableRouter.get(
  '/search',
  validatorsTable.search,
  searchTableControllers.index,
);
TableRouter.get('/find', validatorsTable.find, findTableControllers.index);
TableRouter.delete(
  '/customers',
  validatorsTable.removeCustomer,
  removeCustomerTableControllers.delete,
);

export default TableRouter;

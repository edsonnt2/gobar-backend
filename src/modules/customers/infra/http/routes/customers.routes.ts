import { Router } from 'express';
import SearchCustomerControllers from '../controllers/SearchCustomerControllers';
import CustomerControllers from '../controllers/CustomerControllers';
import customersValidators from '../validators/customersValidators';

const CustomersRoutes = Router();
const searchCustomerControllers = new SearchCustomerControllers();
const customerControllers = new CustomerControllers();

CustomersRoutes.get(
  '/search',
  customersValidators.customersSearch,
  searchCustomerControllers.index,
);

CustomersRoutes.post(
  '/',
  customersValidators.customersCreate,
  customerControllers.create,
);

CustomersRoutes.get(
  '/:id',
  customersValidators.customersShow,
  customerControllers.show,
);

export default CustomersRoutes;

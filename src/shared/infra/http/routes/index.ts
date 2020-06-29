import { Router } from 'express';
import UserRoutes from '@modules/users/infra/http/routes/users.routes';
import SessionRoutes from '@modules/users/infra/http/routes/sessions.routes';
import BusinessRoutes from '@modules/business/infra/http/routes/business.routes';
import CategoryRoutes from '@modules/categories/infra/http/routes/categories.routes';
import ProductRoutes from '@modules/products/infra/http/routes/products.routes';
import IngressRouter from '@modules/ingress/infra/http/routes/ingress.routes';
import CustomersRoutes from '@modules/customers/infra/http/routes/customers.routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/sessions', SessionRoutes);
routes.use('/business', ensureAuthenticated, BusinessRoutes);
routes.use('/business/categories', ensureAuthenticated, CategoryRoutes);
routes.use('/products', ensureAuthenticated, ProductRoutes);
routes.use('/ingress', ensureAuthenticated, IngressRouter);
routes.use('/customers', ensureAuthenticated, CustomersRoutes);

export default routes;

import { Router } from 'express';
import UserRoutes from '@modules/users/infra/http/routes/users.routes';
import SessionRoutes from '@modules/users/infra/http/routes/sessions.routes';
import BusinessRoutes from '@modules/business/infra/http/routes/business.routes';
import CategoryRoutes from '@modules/categories/infra/http/routes/categories.routes';
import ProductRoutes from '@modules/products/infra/http/routes/products.routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/sessions', SessionRoutes);
routes.use('/business', ensureAuthenticated, BusinessRoutes);
routes.use('/business/categories', ensureAuthenticated, CategoryRoutes);
routes.use('/products', ensureAuthenticated, ProductRoutes);

export default routes;

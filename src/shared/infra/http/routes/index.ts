import { Router } from 'express';
import UserRoutes from '@modules/users/infra/http/routes/users.routes';
import SessionRoutes from '@modules/users/infra/http/routes/sessions.routes';
import BusinessRoutes from '@modules/business/infra/http/routes/business.routes';
import CategoryRoutes from '@modules/categories/infra/http/routes/categories.routes';
import ProductRoutes from '@modules/products/infra/http/routes/products.routes';
import IngressRouter from '@modules/ingress/infra/http/routes/ingress.routes';
import CustomersRoutes from '@modules/customers/infra/http/routes/customers.routes';
import CommandRouter from '@modules/commands/infra/http/routes/commands.routes';
import CommandProductRouter from '@modules/itemsForSale/infra/http/routes/commandsProducts.routes';
import CommandClosureRouter from '@modules/commands/infra/http/routes/commandsClosure.routes';
import AnyDiscountRouter from '@modules/anyDiscounts/infra/http/routes/anyDiscount.routes';
import TableRouter from '@modules/tables/infra/http/routes/tables.routes';
import TableProductRouter from '@modules/itemsForSale/infra/http/routes/tablesProducts.routes';
import TableClosureRouter from '@modules/tables/infra/http/routes/tablesClosure.routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/sessions', SessionRoutes);
routes.use('/business', ensureAuthenticated, BusinessRoutes);
routes.use('/business/categories', ensureAuthenticated, CategoryRoutes);
routes.use('/products', ensureAuthenticated, ProductRoutes);
routes.use('/ingress', ensureAuthenticated, IngressRouter);
routes.use('/customers', ensureAuthenticated, CustomersRoutes);
routes.use('/payments/discounts', ensureAuthenticated, AnyDiscountRouter);
routes.use('/commands', ensureAuthenticated, CommandRouter);
routes.use('/commands/products', ensureAuthenticated, CommandProductRouter);
routes.use('/payments/commands', ensureAuthenticated, CommandClosureRouter);

routes.use('/tables', ensureAuthenticated, TableRouter);
routes.use('/tables/products', ensureAuthenticated, TableProductRouter);
routes.use('/payments/tables', ensureAuthenticated, TableClosureRouter);

export default routes;

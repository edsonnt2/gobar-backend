import { Router } from 'express';
import UserRoutes from '@modules/users/infra/http/routes/users.routes';
import SessionRoutes from '@modules/users/infra/http/routes/sessions.routes';
import BusinessRoutes from '@modules/business/infra/http/routes/business.routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/sessions', SessionRoutes);
routes.use('/business', ensureAuthenticated, BusinessRoutes);

export default routes;

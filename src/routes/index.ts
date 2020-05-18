import { Router } from 'express';
import UserRoutes from '../users/routes/users.routes';
import SessionRoutes from '../users/routes/sessions.routes';

const routes = Router();

routes.use('/users', UserRoutes);
routes.use('/sessions', SessionRoutes);

export default routes;

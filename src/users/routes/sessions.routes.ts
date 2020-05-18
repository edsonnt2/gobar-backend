import { Router } from 'express';
import SessionsControllers from '../controllers/SessionsController';

const UserRoutes = Router();
const sessionsControllers = new SessionsControllers();

UserRoutes.post('/', sessionsControllers.create);

export default UserRoutes;

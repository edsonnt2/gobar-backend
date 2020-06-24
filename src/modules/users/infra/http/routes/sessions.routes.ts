import { Router } from 'express';
import SessionsControllers from '../controllers/SessionsController';

const SessionsRoutes = Router();
const sessionsControllers = new SessionsControllers();

SessionsRoutes.post('/', sessionsControllers.create);

export default SessionsRoutes;

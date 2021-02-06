import { Router } from 'express';
import ensureAuthenticated from '@shared/infra/http/middleware/ensureAuthenticated';
import SessionsControllers from '../controllers/SessionsController';

const SessionsRoutes = Router();
const sessionsControllers = new SessionsControllers();

SessionsRoutes.post('/', sessionsControllers.create);

SessionsRoutes.get('/', ensureAuthenticated, sessionsControllers.show);

export default SessionsRoutes;

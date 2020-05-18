import { Router } from 'express';
import UsersControllers from '../controllers/UsersController';

const UserRoutes = Router();
const usersControllers = new UsersControllers();

UserRoutes.post('/', usersControllers.create);

export default UserRoutes;

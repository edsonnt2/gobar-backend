import { Router } from 'express';
import UsersControllers from '../controllers/UsersController';
import usersValidators from '../validators/usersValidators';

const UserRoutes = Router();
const usersControllers = new UsersControllers();

UserRoutes.post('/', usersValidators.usersCreate, usersControllers.create);

export default UserRoutes;

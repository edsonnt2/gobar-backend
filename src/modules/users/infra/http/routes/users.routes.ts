import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import UsersControllers from '../controllers/UsersController';

const UserRoutes = Router();
const usersControllers = new UsersControllers();

UserRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      full_name: Joi.string().required(),
      email: Joi.string().email().required(),
      cell_phone: Joi.string().min(15).max(15).trim().required(),
      password: Joi.string().required(),
      birthDate: Joi.string().min(10).max(10).trim().required(),
    },
  }),
  usersControllers.create,
);

export default UserRoutes;

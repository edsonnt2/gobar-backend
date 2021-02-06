import { celebrate, Segments, Joi } from 'celebrate';

export default {
  usersCreate: celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cell_phone: Joi.string().required(),
      password: Joi.string().required(),
      birthDate: Joi.string().min(10).max(10).trim().required(),
    },
  }),
};

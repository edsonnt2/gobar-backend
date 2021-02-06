import { celebrate, Segments, Joi } from 'celebrate';

export default {
  ingressCreate: celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
      consume: Joi.boolean().required(),
      value: Joi.number().required(),
    },
  }),
  ingressDelete: celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
};

import { celebrate, Segments, Joi } from 'celebrate';

export default {
  entranceCreate: celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
      consume: Joi.boolean().required(),
      value: Joi.number().required(),
    },
  }),
  entranceDelete: celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
};

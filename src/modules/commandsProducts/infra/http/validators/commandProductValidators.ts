import { celebrate, Segments, Joi } from 'celebrate';

export default {
  create: celebrate({
    [Segments.BODY]: {
      command: Joi.number().required(),
      products: Joi.array()
        .min(1)
        .items({
          quantity: Joi.number().required(),
          product_id: Joi.string(),
          description: Joi.string(),
          value: Joi.number(),
        })
        .required(),
    },
  }),
};

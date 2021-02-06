import { celebrate, Segments, Joi } from 'celebrate';

export default {
  create: celebrate({
    [Segments.BODY]: {
      table: Joi.number().required(),
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
  delete: celebrate({
    [Segments.QUERY]: {
      table_id: Joi.string().required(),
      table_product_id: Joi.string().required(),
    },
  }),
};

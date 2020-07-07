import { celebrate, Segments, Joi } from 'celebrate';

export default {
  create: celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().required(),
      number: Joi.number().required(),
      ingress_id: Joi.string(),
      prepaid_ingress: Joi.boolean(),
      value_consume: Joi.number(),
    },
  }),
  search: celebrate({
    [Segments.QUERY]: {
      search: Joi.string().required(),
    },
  }),
};

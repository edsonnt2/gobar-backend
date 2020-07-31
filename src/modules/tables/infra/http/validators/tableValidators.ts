import { celebrate, Segments, Joi } from 'celebrate';

export default {
  create: celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string(),
      number: Joi.number().required(),
    },
  }),
  index: celebrate({
    [Segments.QUERY]: {
      closed: Joi.boolean(),
    },
  }),
  search: celebrate({
    [Segments.QUERY]: {
      search: Joi.string().required(),
      closed: Joi.boolean(),
    },
  }),
  find: celebrate({
    [Segments.QUERY]: {
      number: Joi.number().required(),
      closed: Joi.boolean(),
    },
  }),
  removeCustomer: celebrate({
    [Segments.QUERY]: {
      table_id: Joi.string().required(),
      customer_id: Joi.string().required(),
    },
  }),
};

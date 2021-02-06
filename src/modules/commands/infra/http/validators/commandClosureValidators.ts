import { celebrate, Segments, Joi } from 'celebrate';

export default {
  create: celebrate({
    [Segments.BODY]: {
      value_total: Joi.number().required(),
      discount: Joi.number(),
      command_ids: Joi.array().min(1).required(),
      payment_commands_closure: Joi.array()
        .min(1)
        .max(2)
        .items({
          type: Joi.string().required(),
          subtotal: Joi.number().required(),
          received: Joi.number(),
          type_card: Joi.string(),
        })
        .required(),
    },
  }),
};

import { celebrate, Segments, Joi } from 'celebrate';

export default {
  productCreate: celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
      category: Joi.string().required(),
      quantity: Joi.number().required(),
      provider: Joi.string().required(),
      internal_code: Joi.string().required(),
      barcode: Joi.string(),
      pushase_value: Joi.number().required(),
      porcent: Joi.number(),
      sale_value: Joi.number().required(),
    },
  }),
  productImage: celebrate({
    [Segments.QUERY]: {
      product_id: Joi.string(),
    },
  }),
};

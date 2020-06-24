import { celebrate, Segments, Joi } from 'celebrate';

export default {
  productCreate: celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
      category: Joi.string().required(),
      quantity: Joi.string().required(),
      provider: Joi.string().required(),
      internal_code: Joi.string().required(),
      barcode: Joi.string(),
      pushase_value: Joi.string().required(),
      porcent: Joi.string(),
      sale_value: Joi.string().required(),
    },
  }),
  productImage: celebrate({
    [Segments.QUERY]: {
      product_id: Joi.string().required(),
    },
  }),
  searchCategory: celebrate({
    [Segments.QUERY]: {
      search: Joi.string().required(),
    },
  }),
};

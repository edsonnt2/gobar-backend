import { celebrate, Segments, Joi } from 'celebrate';

export default {
  businessCreate: celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      categories: Joi.array()
        .items(Joi.string().required())
        .min(1)
        .max(4)
        .required(),
      cell_phone: Joi.string(),
      phone: Joi.string(),
      cpf_or_cnpj: Joi.string().required().min(14).max(18).trim(),
      zip_code: Joi.string().required().min(9).max(9).trim(),
      street: Joi.string().required(),
      number: Joi.number().required(),
      complement: Joi.string(),
      district: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    },
  }),
  bussinessSessions: celebrate({
    [Segments.BODY]: {
      business_id: Joi.string().required(),
    },
  }),
};

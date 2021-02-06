import { celebrate, Segments, Joi } from 'celebrate';

export default {
  customersSearch: celebrate({
    [Segments.QUERY]: {
      search: Joi.string().required(),
    },
  }),
  customersShow: celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  customersCreate: celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string(),
      name: Joi.string(),
      cell_phone: Joi.string(),
      email: Joi.string(),
      cpf_or_cnpj: Joi.string(),
      gender: Joi.string(),
      birthDate: Joi.string(),
    },
  }),
};

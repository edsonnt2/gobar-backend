import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import BusinessControllers from '../controllers/BusinessControllers';

const businessRouter = Router();
const businessControllers = new BusinessControllers();

businessRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      category: Joi.string().required(),
      cell_phone: Joi.string().min(15).max(15).trim(),
      phone: Joi.string().min(14).max(14).trim(),
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
  businessControllers.create,
);

export default businessRouter;

import { Router } from 'express';

import IngressControllers from '../controllers/IngressControllers';
import validatorsIngress from '../validators/ingressValidators';

const IngressRouter = Router();
const ingressControllers = new IngressControllers();

IngressRouter.post(
  '/',
  validatorsIngress.ingressCreate,
  ingressControllers.create,
);

IngressRouter.get('/', ingressControllers.index);

IngressRouter.delete(
  '/:id',
  validatorsIngress.ingressDelete,
  ingressControllers.delete,
);

export default IngressRouter;

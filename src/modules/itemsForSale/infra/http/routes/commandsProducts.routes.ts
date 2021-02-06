import { Router } from 'express';

import CommandProductControllers from '../controllers/CommandProductControllers';
import validatorsCommandProduct from '../validators/commandProductValidators';

const CommandProductRouter = Router();
const commandProductControllers = new CommandProductControllers();

CommandProductRouter.post(
  '/',
  validatorsCommandProduct.create,
  commandProductControllers.create,
);

CommandProductRouter.delete(
  '/',
  validatorsCommandProduct.delete,
  commandProductControllers.delete,
);

export default CommandProductRouter;

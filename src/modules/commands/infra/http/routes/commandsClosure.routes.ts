import { Router } from 'express';

import CommandClosureControllers from '../controllers/CommandClosureControllers';
import validatorsCommandClosure from '../validators/commandClosureValidators';

const CommandClosureRouter = Router();
const commandClosureControllers = new CommandClosureControllers();

CommandClosureRouter.post(
  '/',
  validatorsCommandClosure.create,
  commandClosureControllers.create,
);

export default CommandClosureRouter;

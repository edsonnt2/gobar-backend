import { Router } from 'express';

import CommandControllers from '../controllers/CommandControllers';
import validatorsCommand from '../validators/commandValidators';
import SearchCommandControllers from '../controllers/SearchCommandControllers';
import FindCommandControllers from '../controllers/FindCommandControllers';

const CommandRouter = Router();
const commandControllers = new CommandControllers();
const searchCommandControllers = new SearchCommandControllers();
const findCommandControllers = new FindCommandControllers();

CommandRouter.post('/', validatorsCommand.create, commandControllers.create);
CommandRouter.get('/', validatorsCommand.index, commandControllers.index);
CommandRouter.get(
  '/search',
  validatorsCommand.search,
  searchCommandControllers.index,
);
CommandRouter.get(
  '/find',
  validatorsCommand.find,
  findCommandControllers.index,
);

export default CommandRouter;

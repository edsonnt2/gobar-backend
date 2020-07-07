import { Router } from 'express';

import CommandControllers from '../controllers/CommandControllers';
import validatorsCommand from '../validators/commandValidators';
import SearchCommandControllers from '../controllers/SearchCommandControllers';

const CommandRouter = Router();
const commandControllers = new CommandControllers();
const searchCommandControllers = new SearchCommandControllers();

CommandRouter.post('/', validatorsCommand.create, commandControllers.create);
CommandRouter.get('/', commandControllers.index);
CommandRouter.get(
  '/search',
  validatorsCommand.search,
  searchCommandControllers.index,
);

export default CommandRouter;

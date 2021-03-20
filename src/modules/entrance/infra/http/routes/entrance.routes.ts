import { Router } from 'express';

import EntranceControllers from '../controllers/EntranceControllers';
import validatorsEntrance from '../validators/entranceValidators';

const EntranceRouter = Router();
const entranceControllers = new EntranceControllers();

EntranceRouter.post(
  '/',
  validatorsEntrance.entranceCreate,
  entranceControllers.create,
);

EntranceRouter.get('/', entranceControllers.index);

EntranceRouter.delete(
  '/:id',
  validatorsEntrance.entranceDelete,
  entranceControllers.delete,
);

export default EntranceRouter;

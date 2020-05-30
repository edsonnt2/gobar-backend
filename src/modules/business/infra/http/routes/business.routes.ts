import { Router } from 'express';
import multer from 'multer';
import configUpload from '@config/upload';

import BusinessControllers from '../controllers/BusinessControllers';
import AvatarBusinessControllers from '../controllers/AvatarBusinessControllers';
import SessionsBusinessControllers from '../controllers/SessionsBusinessControllers';
import validatorsBusiness from '../validators/businessValidators';

const businessRouter = Router();
const businessControllers = new BusinessControllers();
const avatarBusinessControllers = new AvatarBusinessControllers();
const sessionsBusinessControllers = new SessionsBusinessControllers();
const upload = multer(configUpload.multer);

businessRouter.post(
  '/',
  validatorsBusiness.businessCreate,
  businessControllers.create,
);

businessRouter.patch(
  '/avatar',
  upload.single('avatar'),
  avatarBusinessControllers.update,
);

businessRouter.post(
  '/sessions',
  validatorsBusiness.bussinessSessions,
  sessionsBusinessControllers.create,
);

export default businessRouter;

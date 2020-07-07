import 'reflect-metadata';
import 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';
import AppError from '@shared/error/AppError';
import uploadConfig from '@config/upload';
import '@shared/infra/typeorm';
import '@shared/container';

import routes from './routes';
import rateLimiter from './middleware/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/file', express.static(uploadConfig.folderUpload));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

interface IError extends Error {
  code: string;
}

app.use((err: IError, req: Request, res: Response, _Next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.code).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err.code === '22P02') {
    return res.status(404).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line
  console.log(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server connected in PORT ${PORT}`));

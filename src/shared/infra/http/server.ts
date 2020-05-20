import 'reflect-metadata';
import 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import AppError from '@shared/error/AppError';
import routes from './routes';

import '../typeorm';
import '@shared/container';

const app = express();

app.use(express.json());

app.use(routes);

app.use(errors());

app.use((err: Error, req: Request, res: Response, _Next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.code).json({
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

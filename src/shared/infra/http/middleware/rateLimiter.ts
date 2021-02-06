import Redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/error/AppError';

const storeClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient,
  keyPrefix: 'ratelimiter',
  points: 5,
  duration: 1,
});

async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(req.ip);

    next();
  } catch {
    throw new AppError('Too Many Requests', 429);
  }
}

export default rateLimiter;

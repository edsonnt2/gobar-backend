import { RedisOptions } from 'ioredis';

interface ICache {
  config: {
    redis: RedisOptions;
  };
}

export default {
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || undefined,
    },
  },
} as ICache;

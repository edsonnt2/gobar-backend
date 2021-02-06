import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import IAuthProvider from '../models/ICacheProvider';

class RedisProvider implements IAuthProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  // eslint-disable-next-line
  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const cached = await this.client.get(key);

    return cached ? (JSON.parse(cached) as T) : null;
  }

  public async remove(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default RedisProvider;

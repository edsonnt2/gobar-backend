import ICacheProvider from '../models/ICacheProvider';

interface IRedisCache {
  [key: string]: string;
}

class RedisProvider implements ICacheProvider {
  private redis: IRedisCache = {};

  // eslint-disable-next-line
  public async save(key: string, value: any): Promise<void> {
    this.redis[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const cached = this.redis[key];

    return cached ? (JSON.parse(cached) as T) : null;
  }

  public async remove(key: string): Promise<void> {
    delete this.redis[key];
  }
}

export default RedisProvider;

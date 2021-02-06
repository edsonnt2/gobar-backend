export default interface ICacheProvider {
  // eslint-disable-next-line
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
}

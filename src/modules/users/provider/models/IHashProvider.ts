export default interface IHashProvider {
  generateHash(password: string): Promise<string>;
  compareHash(password: string, hashedCampare: string): Promise<boolean>;
}

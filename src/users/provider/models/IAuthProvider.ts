export default interface IAuthProvider {
  signIn(id: string): string;
}

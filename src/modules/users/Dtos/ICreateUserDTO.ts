export default interface ICreateUserDTO {
  name: string;
  cell_phone: number;
  email: string;
  password: string;
  birthDate: string;
  gender?: 'W' | 'M';
}

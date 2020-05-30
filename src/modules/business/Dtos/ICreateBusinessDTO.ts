export default interface ICreateBusinessDTO {
  user_id: string;
  avatar?: string;
  name: string;
  categories: {
    name: string;
  }[];
  cell_phone?: number;
  phone?: number;
  cpf_or_cnpj: string;
  zip_code: string;
  number: number;
  complement?: string;
  street: string;
  district: string;
  city: string;
  state: string;
}

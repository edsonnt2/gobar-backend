export default interface ICreateBusinessDTO {
  user_id: string;
  name: string;
  category: string;
  cell_phone?: string;
  phone?: string;
  cpf_or_cnpj: string;
  zip_code: string;
  number: number;
  complement?: string;
  street: string;
  district: string;
  city: string;
  state: string;
}

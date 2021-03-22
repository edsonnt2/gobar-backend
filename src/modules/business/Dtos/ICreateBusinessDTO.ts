export default interface ICreateBusinessDTO {
  user_id: string;
  avatar?: string;
  name: string;
  categories: {
    name: string;
  }[];
  cell_phone?: number;
  phone?: number;
  taxId: number;
  zip_code: string;
  number: number;
  complement?: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

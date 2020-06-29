export default interface ICreateCustomerDTO {
  name: string;
  cell_phone?: number;
  email?: string;
  cpf_or_cnpj?: number;
  birthDate: string;
  gender: 'W' | 'M';
  business_id: string;
}

export default interface ICreateCustomerDTO {
  name: string;
  cell_phone?: number;
  email?: string;
  taxId?: number;
  birthDate: string;
  gender: 'W' | 'M';
  business_id: string;
}

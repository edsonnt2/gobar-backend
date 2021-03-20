export default interface IFindInCustomerDTO {
  find: string | number;
  where: 'name' | 'cell_phone' | 'email' | 'taxId';
}

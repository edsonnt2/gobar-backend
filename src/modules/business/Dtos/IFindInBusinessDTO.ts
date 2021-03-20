export default interface IFindInBusinessDTO {
  find: string | number;
  where: 'name' | 'cell_phone' | 'phone' | 'taxId';
}

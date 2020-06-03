export default interface IFindInProductDTO {
  find: string;
  where: 'description' | 'internal_code' | 'barcode';
  business_id: string;
}

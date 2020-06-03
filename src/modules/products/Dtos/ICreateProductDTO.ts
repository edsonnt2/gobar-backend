export default interface ICreateProductDTO {
  business_id: string;
  image?: string;
  description: string;
  category: string;
  quantity: number;
  provider: string;
  internal_code: string;
  barcode?: string;
  pushase_value: number;
  porcent?: number;
  sale_value: number;
}

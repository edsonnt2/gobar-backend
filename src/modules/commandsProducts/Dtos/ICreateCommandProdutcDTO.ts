export default interface ICreateCommandProdutcDTO {
  command_id: string;
  product_id?: string;
  description: string;
  label_description: string;
  value: number;
  quantity: number;
}

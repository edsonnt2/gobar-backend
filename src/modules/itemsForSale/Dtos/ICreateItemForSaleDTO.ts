export default interface ICreateItemForSaleDTO {
  operator_id: string;
  command_id?: string;
  table_id?: string;
  product_id?: string;
  description: string;
  label_description: string;
  value: number;
  quantity: number;
}

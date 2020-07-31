export default interface ICreateAnyDiscountDTO {
  business_id: string;
  operator_id: string;
  value_total: number;
  discount?: number;
  command_id?: string;
  table_id?: string;
  payment_discount: {
    type: 'card' | 'money';
    subtotal: number;
    received?: number;
    type_card?: string;
  }[];
}

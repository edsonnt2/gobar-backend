export default interface ICreateTableClosureDTO {
  business_id: string;
  operator_id: string;
  value_total: number;
  discount?: number;
  payment_tables_closure: {
    type: 'card' | 'money';
    subtotal: number;
    received?: number;
    type_card?: string;
  }[];
  table_ids: string[];
}

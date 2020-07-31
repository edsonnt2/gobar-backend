export default interface ICreateCommandClosureDTO {
  business_id: string;
  operator_id: string;
  value_total: number;
  discount?: number;
  payment_commands_closure: {
    type: 'card' | 'money';
    subtotal: number;
    received?: number;
    type_card?: string;
  }[];
  command_ids: string[];
}

export default interface ICreateCommandDTO {
  operator_id: string;
  business_id: string;
  customer_id: string;
  number: number;
  value_entrance?: number;
  entrance_consume?: boolean;
  prepaid_entrance?: boolean;
  value_consume?: number;
}

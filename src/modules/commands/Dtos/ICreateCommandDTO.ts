export default interface ICreateCommandDTO {
  business_id: string;
  customer_id: string;
  number: number;
  value_ingress?: number;
  ingress_consume?: boolean;
  prepaid_ingress?: boolean;
  value_consume?: number;
}

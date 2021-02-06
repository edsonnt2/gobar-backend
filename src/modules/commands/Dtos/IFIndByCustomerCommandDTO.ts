export default interface IFindByCustomerCommandDTO {
  customer_id: string;
  business_id: string;
  closed?: boolean;
}

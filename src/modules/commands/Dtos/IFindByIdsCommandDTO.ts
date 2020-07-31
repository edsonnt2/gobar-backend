export default interface IFindByIdsCommandDTO {
  ids: string[];
  business_id: string;
  closed?: boolean;
}

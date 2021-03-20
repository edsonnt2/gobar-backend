export default interface IFindInEntranceDTO {
  find: string | number;
  where: 'description' | 'type' | 'value';
}

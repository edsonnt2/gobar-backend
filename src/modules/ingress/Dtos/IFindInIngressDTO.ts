export default interface IFindInIngressDTO {
  find: string | number;
  where: 'description' | 'type' | 'value';
}

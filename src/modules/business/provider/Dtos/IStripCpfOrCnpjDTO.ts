export default interface IStripCpfOrCnpjDTO {
  cpf_or_cnpj: string;
  type: 'cpf' | 'cnpj';
}

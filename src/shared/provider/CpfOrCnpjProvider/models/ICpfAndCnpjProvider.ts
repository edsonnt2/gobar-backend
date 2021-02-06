import IStripCpfOrCnpjDTO from '../Dtos/IStripCpfOrCnpjDTO';
import IValidateCpfOrCnpjDTO from '../Dtos/IValidateCpfOrCnpjDTO';

export default interface ICpfAndCnpjProvider {
  validateCpfOrCnpj({
    cpf_or_cnpj,
  }: IValidateCpfOrCnpjDTO): { type: 'cpf' | 'cnpj' } | undefined;
  stripCpfOrCnpj({ cpf_or_cnpj, type }: IStripCpfOrCnpjDTO): string;
  formatCpfOrCnpj({ cpf_or_cnpj, type }: IStripCpfOrCnpjDTO): string;
}

import * as validateCpf from '@fnando/cpf';
import * as validateCnpj from '@fnando/cnpj';
import ICpfAndCnpjProvider from '../models/ICpfAndCnpjProvider';
import IStripCpfOrCnpjDTO from '../Dtos/IStripCpfOrCnpjDTO';
import IValidateCpfOrCnpjDTO from '../Dtos/IValidateCpfOrCnpjDTO';

class CpfAndCnpjProvider implements ICpfAndCnpjProvider {
  public validateCpfOrCnpj({
    cpf_or_cnpj,
  }: IValidateCpfOrCnpjDTO): { type: 'cpf' | 'cnpj' } | undefined {
    return (
      (validateCpf.isValid(cpf_or_cnpj) && { type: 'cpf' }) ||
      (validateCnpj.isValid(cpf_or_cnpj) && { type: 'cnpj' }) ||
      undefined
    );
  }

  public stripCpfOrCnpj({ cpf_or_cnpj, type }: IStripCpfOrCnpjDTO): string {
    return type === 'cpf'
      ? validateCpf.strip(cpf_or_cnpj)
      : validateCnpj.strip(cpf_or_cnpj);
  }

  public formatCpfOrCnpj({ cpf_or_cnpj, type }: IStripCpfOrCnpjDTO): string {
    return type === 'cpf'
      ? validateCpf.format(cpf_or_cnpj)
      : validateCnpj.format(cpf_or_cnpj);
  }
}

export default CpfAndCnpjProvider;

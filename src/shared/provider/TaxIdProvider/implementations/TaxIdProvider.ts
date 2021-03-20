import * as validateCpf from '@fnando/cpf';
import * as validateCnpj from '@fnando/cnpj';
import ITaxIdProvider from '../models/ITaxIdProvider';
import IStripTaxIdDTO from '../Dtos/IStripTaxIdDTO';
import IValidateTaxIdDTO from '../Dtos/IValidateTaxIdDTO';

class TaxIdProvider implements ITaxIdProvider {
  public validateTaxId({
    taxId,
  }: IValidateTaxIdDTO): { type: 'cpf' | 'cnpj' } | undefined {
    return (
      (validateCpf.isValid(taxId) && { type: 'cpf' }) ||
      (validateCnpj.isValid(taxId) && { type: 'cnpj' }) ||
      undefined
    );
  }

  public stripTaxId({ taxId, type }: IStripTaxIdDTO): string {
    return type === 'cpf'
      ? validateCpf.strip(taxId)
      : validateCnpj.strip(taxId);
  }

  public formattaxId({ taxId, type }: IStripTaxIdDTO): string {
    return type === 'cpf'
      ? validateCpf.format(taxId)
      : validateCnpj.format(taxId);
  }
}

export default TaxIdProvider;

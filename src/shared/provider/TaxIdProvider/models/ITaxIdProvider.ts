import IStripTaxIdDTO from '../Dtos/IStripTaxIdDTO';
import IValidateTaxIdDTO from '../Dtos/IValidateTaxIdDTO';

export default interface ITaxIdProvider {
  validateTaxId({
    taxId,
  }: IValidateTaxIdDTO): { type: 'cpf' | 'cnpj' } | undefined;
  stripTaxId({ taxId, type }: IStripTaxIdDTO): string;
  formattaxId({ taxId, type }: IStripTaxIdDTO): string;
}

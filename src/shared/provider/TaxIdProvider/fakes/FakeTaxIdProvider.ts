import ITaxIdProvider from '../models/ITaxIdProvider';
import IStripTaxIdDTO from '../Dtos/IStripTaxIdDTO';
import IValidateTaxIdDTO from '../Dtos/IValidateTaxIdDTO';

class FakeTaxIdProvider implements ITaxIdProvider {
  public validateTaxId({
    taxId,
  }: IValidateTaxIdDTO): { type: 'cpf' | 'cnpj' } | undefined {
    const newtaxId = taxId.replace(/[^0-9]/g, '');
    return (
      (newtaxId.length === 11 && { type: 'cpf' }) ||
      (newtaxId.length === 14 && { type: 'cnpj' }) ||
      undefined
    );
  }

  public stripTaxId(data: IStripTaxIdDTO): string {
    return data.taxId.replace(/[^0-9]/g, '');
  }

  public formattaxId(data: IStripTaxIdDTO): string {
    return data.taxId;
  }
}

export default FakeTaxIdProvider;

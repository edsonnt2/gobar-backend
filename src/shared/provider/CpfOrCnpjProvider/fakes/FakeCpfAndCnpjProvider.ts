import ICpfAndCnpjProvider from '../models/ICpfAndCnpjProvider';
import IStripCpfOrCnpjDTO from '../Dtos/IStripCpfOrCnpjDTO';
import IValidateCpfOrCnpjDTO from '../Dtos/IValidateCpfOrCnpjDTO';

class FakeCpfAndCnpjProvider implements ICpfAndCnpjProvider {
  public validateCpfOrCnpj({
    cpf_or_cnpj,
  }: IValidateCpfOrCnpjDTO): { type: 'cpf' | 'cnpj' } | undefined {
    const newCpfOrCnpj = cpf_or_cnpj.replace(/[^0-9]/g, '');
    return (
      (newCpfOrCnpj.length === 11 && { type: 'cpf' }) ||
      (newCpfOrCnpj.length === 14 && { type: 'cnpj' }) ||
      undefined
    );
  }

  public stripCpfOrCnpj(data: IStripCpfOrCnpjDTO): string {
    return data.cpf_or_cnpj.replace(/[^0-9]/g, '');
  }

  public formatCpfOrCnpj(data: IStripCpfOrCnpjDTO): string {
    return data.cpf_or_cnpj;
  }
}

export default FakeCpfAndCnpjProvider;

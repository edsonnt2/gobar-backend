import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import ICreateBusinessDTO from '../Dtos/ICreateBusinessDTO';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';
import ICpfAndCnpjProvider from '../provider/models/ICpfAndCnpjProvider';

@injectable()
class CreateBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('CpfAndCnpjProvider')
    private cpfAndCnpjProvider: ICpfAndCnpjProvider,
  ) {}

  public async execute({
    user_id,
    name,
    category,
    cell_phone,
    phone,
    cpf_or_cnpj,
    zip_code,
    street,
    number,
    complement,
    district,
    city,
    state,
  }: ICreateBusinessDTO): Promise<Business> {
    const nameBusiness = await this.businessRepository.findInBusiness({
      find: name,
      where: 'name',
    });

    if (nameBusiness) throw new AppError('Business name already registered.');

    if (cell_phone) {
      const cellPhoneBusiness = await this.businessRepository.findInBusiness({
        find: cell_phone,
        where: 'cell_phone',
      });

      if (cellPhoneBusiness && cellPhoneBusiness.user_id !== user_id)
        throw new AppError(
          'Cell phone already registered with another business.',
        );
    }

    if (phone) {
      const phoneBusiness = await this.businessRepository.findInBusiness({
        find: phone,
        where: 'phone',
      });

      if (phoneBusiness && phoneBusiness.user_id !== user_id)
        throw new AppError('Phone already registered with another business.');
    }

    const isCpfOrCnpj = this.cpfAndCnpjProvider.validateCpfOrCnpj({
      cpf_or_cnpj,
    });

    if (!isCpfOrCnpj) throw new AppError('Cpf or Cnpf informed is invalid.');

    const { type } = isCpfOrCnpj;

    const stripCpfOrCnpj = this.cpfAndCnpjProvider.stripCpfOrCnpj({
      cpf_or_cnpj,
      type,
    });

    const formatedCpfOrCnpj = this.cpfAndCnpjProvider.formatCpfOrCnpj({
      cpf_or_cnpj: stripCpfOrCnpj,
      type,
    });

    const cpfOrCnpjBusiness = await this.businessRepository.findInBusiness({
      find: formatedCpfOrCnpj,
      where: 'cpf_or_cnpj',
    });

    if (cpfOrCnpjBusiness) {
      if (
        stripCpfOrCnpj.length === 11 &&
        cpfOrCnpjBusiness.user_id !== user_id
      ) {
        throw new AppError(
          'CPF registered at another business for another user.',
        );
      } else {
        throw new AppError('CNPJ registered at another business.');
      }
    }

    const business = await this.businessRepository.create({
      user_id,
      name,
      category,
      cpf_or_cnpj: formatedCpfOrCnpj,
      cell_phone,
      phone,
      zip_code,
      street,
      number,
      complement,
      district,
      city,
      state,
    });

    return business;
  }
}

export default CreateBusinessService;

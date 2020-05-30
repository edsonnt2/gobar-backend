import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import ICacheProvider from '@shared/provider/CacheProvider/models/ICacheProvider';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';
import ICpfAndCnpjProvider from '../provider/models/ICpfAndCnpjProvider';

interface IRequest {
  user_id: string;
  avatar?: string;
  name: string;
  categories: string[];
  cell_phone?: string;
  phone?: string;
  cpf_or_cnpj: string;
  zip_code: string;
  number: number;
  complement?: string;
  street: string;
  district: string;
  city: string;
  state: string;
}

@injectable()
class CreateBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('CpfAndCnpjProvider')
    private cpfAndCnpjProvider: ICpfAndCnpjProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('AuthProvider')
    private authProvider: IAuthProvider,
  ) {}

  public async execute({
    user_id,
    name,
    categories,
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
  }: IRequest): Promise<{ business: Business; token: string }> {
    const nameBusiness = await this.businessRepository.findInBusiness({
      find: name,
      where: 'name',
    });

    if (nameBusiness) throw new AppError('Business name already registered');

    const formattedCellPhone =
      cell_phone &&
      cell_phone
        .split('')
        .filter(char => Number(char) || char === '0')
        .join('');

    const formattedPhone =
      phone &&
      phone
        .split('')
        .filter(char => Number(char) || char === '0')
        .join('');

    if (formattedCellPhone) {
      const cellPhoneBusiness = await this.businessRepository.findInBusiness({
        find: formattedCellPhone,
        where: 'cell_phone',
      });

      if (cellPhoneBusiness && cellPhoneBusiness.user_id !== user_id)
        throw new AppError(
          'Cell phone already registered with another business',
        );
    }

    if (formattedPhone) {
      const phoneBusiness = await this.businessRepository.findInBusiness({
        find: formattedPhone,
        where: 'phone',
      });

      if (phoneBusiness && phoneBusiness.user_id !== user_id)
        throw new AppError('Phone already registered with another business');
    }

    const isCpfOrCnpj = this.cpfAndCnpjProvider.validateCpfOrCnpj({
      cpf_or_cnpj,
    });

    if (!isCpfOrCnpj) throw new AppError('Cpf or Cnpf informed is invalid');

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
      if (stripCpfOrCnpj.length === 11) {
        if (cpfOrCnpjBusiness.user_id !== user_id)
          throw new AppError(
            'CPF registered at another business for another user',
          );
      } else {
        throw new AppError('CNPJ registered at another business');
      }
    }

    const formattedCategory = categories.map(findCategory => ({
      name: findCategory.toLowerCase(),
    }));

    const cached = await this.cacheProvider.recover<string>(
      `avatar-tmp-business:${user_id}`,
    );

    let avatar: string | undefined;
    if (cached) {
      avatar = cached;

      await this.cacheProvider.remove(`avatar-tmp-business:${user_id}`);
    }

    const business = await this.businessRepository.create({
      user_id,
      avatar,
      name,
      categories: formattedCategory,
      cpf_or_cnpj: formatedCpfOrCnpj,
      cell_phone: Number(formattedCellPhone),
      phone: Number(formattedPhone),
      zip_code,
      street,
      number,
      complement,
      district,
      city,
      state,
    });

    const token = this.authProvider.signIn({
      user_id,
      business_id: business.id,
    });

    return { business, token };
  }
}

export default CreateBusinessService;

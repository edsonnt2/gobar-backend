import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import ICpfAndCnpjProvider from '@shared/provider/CpfOrCnpjProvider/models/ICpfAndCnpjProvider';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
  avatar?: string;
  name: string;
  categories: string;
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

    @inject('AuthProvider')
    private authProvider: IAuthProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    avatar,
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

    const formattedCategory = categories.split(',').map(category => ({
      name: category.toLowerCase().trim(),
    }));

    if (formattedCategory.length > 4)
      throw new AppError('Maximun number of categories is 4');

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

      if (cellPhoneBusiness && cellPhoneBusiness.user_id !== user_id) {
        throw new AppError(
          'Cell phone already registered with another business',
        );
      }
    }

    if (formattedPhone) {
      const phoneBusiness = await this.businessRepository.findInBusiness({
        find: formattedPhone,
        where: 'phone',
      });

      if (phoneBusiness && phoneBusiness.user_id !== user_id) {
        throw new AppError('Phone already registered with another business');
      }
    }

    const isCpfOrCnpj = this.cpfAndCnpjProvider.validateCpfOrCnpj({
      cpf_or_cnpj,
    });

    if (!isCpfOrCnpj) {
      throw new AppError('Cpf or Cnpf informed is invalid');
    }

    const { type } = isCpfOrCnpj;

    const stripCpfOrCnpj = this.cpfAndCnpjProvider.stripCpfOrCnpj({
      cpf_or_cnpj,
      type,
    });

    const cpfOrCnpjBusiness = await this.businessRepository.findInBusiness({
      find: stripCpfOrCnpj,
      where: 'cpf_or_cnpj',
    });

    if (cpfOrCnpjBusiness) {
      if (stripCpfOrCnpj.length === 11) {
        if (cpfOrCnpjBusiness.user_id !== user_id) {
          throw new AppError(
            'CPF registered at another business for another user',
          );
        }
      } else {
        throw new AppError('CNPJ registered at another business');
      }
    }

    if (avatar) this.storageProvider.saveFile(avatar);

    const business = await this.businessRepository.create({
      user_id,
      avatar,
      name,
      categories: formattedCategory,
      cpf_or_cnpj: Number(stripCpfOrCnpj),
      zip_code,
      street,
      number,
      complement,
      district,
      city,
      state,
      ...(formattedCellPhone && { cell_phone: Number(formattedCellPhone) }),
      ...(formattedPhone && { phone: Number(formattedPhone) }),
    });

    const token = this.authProvider.signIn({
      user_id,
      business_id: business.id,
    });

    return { business, token };
  }
}

export default CreateBusinessService;

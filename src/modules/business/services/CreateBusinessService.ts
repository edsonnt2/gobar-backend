import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IAuthProvider from '@shared/provider/AuthProvider/models/IAuthProvider';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import ITaxIdProvider from '@shared/provider/TaxIdProvider/models/ITaxIdProvider';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
  avatar?: string;
  name: string;
  categories: string;
  cell_phone?: string;
  phone?: string;
  taxId: string;
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

    @inject('TaxIdProvider')
    private cpfAndCnpjProvider: ITaxIdProvider,

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
    taxId,
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
      name: category,
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

    const istaxId = this.cpfAndCnpjProvider.validateTaxId({
      taxId,
    });

    if (!istaxId) {
      throw new AppError('TaxId informed is invalid');
    }

    const { type } = istaxId;

    const stripTaxId = this.cpfAndCnpjProvider.stripTaxId({
      taxId,
      type,
    });

    const taxIdBusiness = await this.businessRepository.findInBusiness({
      find: stripTaxId,
      where: 'taxId',
    });

    if (taxIdBusiness) {
      if (stripTaxId.length === 11) {
        if (taxIdBusiness.user_id !== user_id) {
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
      taxId: Number(stripTaxId),
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

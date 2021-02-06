import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
  business_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateAvatarBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    business_id,
    avatarFilename,
  }: IRequest): Promise<Business> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found for change avatar.');

    if (business.user_id !== user_id)
      throw new AppError('User not found for this business.');

    const avatar = await this.storageProvider.saveFile(avatarFilename);

    if (business.avatar) await this.storageProvider.deleteFile(business.avatar);

    business.avatar = avatar;
    await this.businessRepository.save(business);

    return business;
  }
}

export default UpdateAvatarBusinessService;

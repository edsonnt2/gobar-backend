import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/provider/CacheProvider/models/ICacheProvider';
import AppError from '@shared/error/AppError';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
  business_id?: string;
  avatarFilename: string;
}

@injectable()
class UpdateAvatarBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    business_id,
    avatarFilename,
  }: IRequest): Promise<Business | { avatar: string }> {
    const business = business_id
      ? await this.businessRepository.findById(business_id)
      : undefined;

    if (business_id && !business)
      throw new AppError('Business not found for change avatar.');

    const avatar = await this.storageProvider.saveFile(avatarFilename);

    const avatarCached = await this.cacheProvider.recover<string>(
      `avatar-tmp-business:${user_id}`,
    );

    if (avatarCached) await this.storageProvider.deleteFile(avatarCached);

    if (business) {
      if (business.avatar)
        await this.storageProvider.deleteFile(business.avatar);

      business.avatar = avatar;
      await this.businessRepository.save(business);

      return business;
    }

    await this.cacheProvider.remove(`avatar-tmp-business:${user_id}`);

    await this.cacheProvider.save(`avatar-tmp-business:${user_id}`, avatar);

    return { avatar };
  }
}

export default UpdateAvatarBusinessService;

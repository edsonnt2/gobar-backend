import AppError from '@shared/error/AppError';
import FakeStorageProvider from '@shared/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeBusinessRepository from '../repositories/fakes/FakeBusinessRepository';
import UpdateAvatarBusinessService from './UpdateAvatarBusinessService';

let fakeBusinessRepository: FakeBusinessRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAvatarBusinessService: UpdateAvatarBusinessService;
let business: { id: string };

describe('UpdatedAvatarBusiness', () => {
  beforeEach(async () => {
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateAvatarBusinessService = new UpdateAvatarBusinessService(
      fakeBusinessRepository,
      fakeStorageProvider,
    );

    business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to update avatar with business', async () => {
    const avatarBusiness = await updateAvatarBusinessService.execute({
      user_id: 'user-id',
      business_id: business.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(avatarBusiness).toBe(business);
  });

  it('should not be able to update avatar with non-existing business ', async () => {
    await expect(
      updateAvatarBusinessService.execute({
        user_id: 'user-id',
        business_id: 'non-business',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update avatar with user incorrect', async () => {
    await expect(
      updateAvatarBusinessService.execute({
        user_id: 'user-incorrect',
        business_id: business.id,
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update avatar and removed old avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await updateAvatarBusinessService.execute({
      user_id: 'user-id',
      business_id: business.id,
      avatarFilename: 'avatar.jpg',
    });

    const avatarBusiness = await updateAvatarBusinessService.execute({
      user_id: 'user-id',
      business_id: business.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(avatarBusiness).toBe(business);
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  });
});

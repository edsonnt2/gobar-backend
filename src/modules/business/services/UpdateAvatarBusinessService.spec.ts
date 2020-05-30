import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeStorageProvider from '@shared/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeBusinessRepository from '../repositories/fakes/FakeBusinessRepository';
import UpdateAvatarBusinessService from './UpdateAvatarBusinessService';

let fakeBusinessRepository: FakeBusinessRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeStorageProvider: FakeStorageProvider;
let updateAvatarBusinessService: UpdateAvatarBusinessService;

describe('UpdatedAvatarBusiness', () => {
  beforeEach(() => {
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeStorageProvider = new FakeStorageProvider();
    updateAvatarBusinessService = new UpdateAvatarBusinessService(
      fakeBusinessRepository,
      fakeCacheProvider,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar without business', async () => {
    const avatarBusiness = await updateAvatarBusinessService.execute({
      user_id: 'user-id',
      avatarFilename: 'avatar.jpg',
    });

    expect(avatarBusiness.avatar).toBe('avatar.jpg');
  });

  it('should be able to update avatar with business', async () => {
    const business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares' }],
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

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

  it('should be able to update avatar and removed old avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares' }],
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

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

  it('should be able to update avatar without business', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const avatarBusiness = await updateAvatarBusinessService.execute({
      user_id: 'user-id',
      avatarFilename: 'avatar.jpg',
    });

    const avatarBusinessTwo = await updateAvatarBusinessService.execute({
      user_id: 'user-id',
      avatarFilename: 'avatar2.jpg',
    });

    expect(avatarBusinessTwo.avatar).toBe('avatar2.jpg');
    expect(deleteFile).toHaveBeenCalledWith(avatarBusiness.avatar);
  });
});

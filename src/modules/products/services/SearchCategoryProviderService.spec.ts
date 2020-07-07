import AppError from '@shared/error/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCategoryProviderRepository from '../repositories/fakes/FakeCategoryProviderRepository';
import SearchCategoryProviderService from './SearchCategoryProviderService';

let fakeCategoryProviderRepository: FakeCategoryProviderRepository;
let fakeUserRepository: FakeUserRepository;
let searchCategoryProviderService: SearchCategoryProviderService;

describe('SearchCategoryProduct', () => {
  beforeEach(() => {
    fakeCategoryProviderRepository = new FakeCategoryProviderRepository();
    fakeUserRepository = new FakeUserRepository();
    searchCategoryProviderService = new SearchCategoryProviderService(
      fakeCategoryProviderRepository,
      fakeUserRepository,
    );
  });

  it('should be able to make the search in categories.', async () => {
    const user = await fakeUserRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      cell_phone: 12999999999,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const categories = await fakeCategoryProviderRepository.create([
      { name: 'teste' },
      { name: 'teste 2' },
    ]);

    const searchCategories = await searchCategoryProviderService.execute({
      user_id: user.id,
      search: 'tes',
    });

    expect(searchCategories).toEqual(categories);
  });

  it('should not be able to make the search in categories with non-exists-user.', async () => {
    await expect(
      searchCategoryProviderService.execute({
        user_id: 'non-existis-user',
        search: 'tes',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

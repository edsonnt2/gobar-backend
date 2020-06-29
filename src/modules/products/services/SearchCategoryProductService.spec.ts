import AppError from '@shared/error/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCategoryProductRepository from '../repositories/fakes/FakeCategoryProductRepository';
import SearchCategoryProductService from './SearchCategoryProductService';

let fakeCategoryProductRepository: FakeCategoryProductRepository;
let fakeUserRepository: FakeUserRepository;
let searchCategoryProductService: SearchCategoryProductService;

describe('SearchCategory', () => {
  beforeEach(() => {
    fakeCategoryProductRepository = new FakeCategoryProductRepository();
    fakeUserRepository = new FakeUserRepository();
    searchCategoryProductService = new SearchCategoryProductService(
      fakeCategoryProductRepository,
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

    const categories = await fakeCategoryProductRepository.create([
      { name: 'teste' },
      { name: 'teste 2' },
    ]);

    const searchCategories = await searchCategoryProductService.execute({
      user_id: user.id,
      search: 'tes',
    });

    expect(searchCategories).toEqual(categories);
  });

  it('should not be able to make the search in categories with non-exists-user.', async () => {
    await expect(
      searchCategoryProductService.execute({
        user_id: 'non-existis-user',
        search: 'tes',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

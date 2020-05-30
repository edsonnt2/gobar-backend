import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import SearchCategoryService from './SearchCategoryService';

let fakeCategoryRepository: FakeCategoryRepository;
let fakeUserRepository: FakeUserRepository;
let searchCategoryService: SearchCategoryService;

describe('SearchCategory', () => {
  beforeEach(() => {
    fakeCategoryRepository = new FakeCategoryRepository();
    fakeUserRepository = new FakeUserRepository();
    searchCategoryService = new SearchCategoryService(
      fakeCategoryRepository,
      fakeUserRepository,
    );
  });

  it('should be able to make the search in categories.', async () => {
    const user = await fakeUserRepository.create({
      full_name: 'Name Test',
      email: 'test@test.com',
      cell_phone: 12999999999,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const categories = await fakeCategoryRepository.create([
      { name: 'teste' },
      { name: 'teste 2' },
    ]);

    const searchCategories = await searchCategoryService.execute({
      user_id: user.id,
      search: 'tes',
    });

    expect(searchCategories).toEqual(categories);
  });

  it('should not be able to make the search in categories with non-exists-user.', async () => {
    await expect(
      searchCategoryService.execute({
        user_id: 'non-existis-user',
        search: 'tes',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

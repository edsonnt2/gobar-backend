import AppError from '@shared/error/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeBusinessRepository from '../repositories/fakes/FakeBusinessRepository';
import ListBusinessService from './ListBusinessService';

let fakeBusinessRepository: FakeBusinessRepository;
let fakeUserRepository: FakeUserRepository;
let listBusinessService: ListBusinessService;

describe('ListBusiness', () => {
  beforeEach(() => {
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeUserRepository = new FakeUserRepository();
    listBusinessService = new ListBusinessService(
      fakeBusinessRepository,
      fakeUserRepository,
    );
  });

  it('should be able to list all business for user id', async () => {
    const user = await fakeUserRepository.create({
      name: 'Name Test',
      email: 'mail@test.com',
      cell_phone: 19992698994,
      birthDate: '08-09-1991',
      password: '123456',
    });

    const business = await fakeBusinessRepository.create({
      user_id: user.id,
      name: 'New Business',
      categories: [{ name: 'bares' }],
      cpf_or_cnpj: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    const allBusiness = await listBusinessService.execute({
      user_id: user.id,
    });

    expect(allBusiness).toEqual([business]);
  });

  it('should not be able to list all business with user id no-exists', async () => {
    await expect(
      listBusinessService.execute({
        user_id: 'userid-id-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '../repositories/fakes/FakeBusinessRepository';
import UpdateTableBusinessService from './UpdateTableBusinessService';

let fakeBusinessRepository: FakeBusinessRepository;
let updateTableBusinessService: UpdateTableBusinessService;

describe('UpdateTableBusiness', () => {
  beforeEach(() => {
    fakeBusinessRepository = new FakeBusinessRepository();

    updateTableBusinessService = new UpdateTableBusinessService(
      fakeBusinessRepository,
    );
  });

  it('should be able to update table in business', async () => {
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

    const newBusiness = await updateTableBusinessService.execute({
      user_id: 'user-id',
      business_id: business.id,
      table: 10,
    });

    expect(newBusiness).toBe(business);
    expect(newBusiness.table).toBe(10);
  });

  it('should not be able to update table with non-existing business ', async () => {
    await expect(
      updateTableBusinessService.execute({
        user_id: 'user-id',
        business_id: 'non-business',
        table: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update table with user incorrect', async () => {
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

    await expect(
      updateTableBusinessService.execute({
        user_id: 'user-incorrect',
        business_id: business.id,
        table: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

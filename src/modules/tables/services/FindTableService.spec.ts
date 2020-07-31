import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import FindTableService from './FindTableService';

let fakeTableRepository: FakeTableRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let findTableService: FindTableService;
let business: { id: string };

describe('FindTable', () => {
  beforeEach(async () => {
    fakeTableRepository = new FakeTableRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    findTableService = new FindTableService(
      fakeTableRepository,
      fakeBusinessRepository,
    );

    business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares ' }],
      cpf_or_cnpj: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to find a table', async () => {
    const newTable = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id',
      number: 1,
    });

    const table = await findTableService.execute({
      business_id: business.id,
      number: 1,
    });

    expect(table).toBe(newTable);
  });

  it('should not be able to find a table with business no-exists', async () => {
    await expect(
      findTableService.execute({
        business_id: 'business-no-exists',
        number: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to list a table with number not found', async () => {
    await expect(
      findTableService.execute({
        business_id: business.id,
        number: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

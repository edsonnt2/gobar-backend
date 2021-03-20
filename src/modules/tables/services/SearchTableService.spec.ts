import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import SearchTableService from './SearchTableService';

let fakeTableRepository: FakeTableRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let searchTableService: SearchTableService;
let business: { id: string };

describe('SearchTable', () => {
  beforeEach(async () => {
    fakeTableRepository = new FakeTableRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    searchTableService = new SearchTableService(
      fakeTableRepository,
      fakeBusinessRepository,
    );

    business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares ' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to search a table', async () => {
    const tableOne = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id-one',
      number: 1,
    });

    const tableTwo = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id-two',
      number: 12,
    });

    const tables = await searchTableService.execute({
      business_id: business.id,
      search: '1',
    });

    expect(tables).toStrictEqual([tableOne, tableTwo]);
  });

  it('should not be able to search a table with business no-exists', async () => {
    await expect(
      searchTableService.execute({
        business_id: 'business-no-exists',
        search: '1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import AllTableService from './AllTableService';

let fakeTableRepository: FakeTableRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let allTableService: AllTableService;
let business: { id: string };

describe('AllTable', () => {
  beforeEach(async () => {
    fakeTableRepository = new FakeTableRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    allTableService = new AllTableService(
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
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to all the tables', async () => {
    const tableOne = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      number: 1,
    });

    const tableTwo = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id-two',
      number: 2,
    });

    const tables = await allTableService.execute({
      business_id: business.id,
    });

    expect(tables).toStrictEqual([tableOne, tableTwo]);
  });

  it('should not be able to search a table with business no-exists', async () => {
    await expect(
      allTableService.execute({
        business_id: 'business-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

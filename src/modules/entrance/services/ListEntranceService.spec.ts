import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeEntranceRepository from '../repositories/fakes/FakeEntranceRepository';
import ListEntranceService from './ListEntranceService';

let fakeEntranceRepository: FakeEntranceRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let listEntranceService: ListEntranceService;

describe('ListEntrance', () => {
  beforeEach(() => {
    fakeEntranceRepository = new FakeEntranceRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    listEntranceService = new ListEntranceService(
      fakeEntranceRepository,
      fakeBusinessRepository,
    );
  });

  it('should be able to list all entrance', async () => {
    const business = await fakeBusinessRepository.create({
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

    const newEntrance = await fakeEntranceRepository.create({
      business_id: business.id,
      description: 'New Entrance',
      value: 10.9,
      consume: false,
    });

    const entrance = await listEntranceService.execute({
      business_id: business.id,
    });

    expect(entrance).toEqual([newEntrance]);
  });
  it('should not be able to list all entrance with business no-exists', async () => {
    await expect(
      listEntranceService.execute({
        business_id: 'business-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

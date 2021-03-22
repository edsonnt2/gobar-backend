import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeEntranceRepository from '../repositories/fakes/FakeEntranceRepository';
import CreateEntranceService from './CreateEntranceService';

let fakeEntranceRepository: FakeEntranceRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let createEntranceService: CreateEntranceService;
let business: { id: string };

describe('CreateEntrance', () => {
  beforeEach(async () => {
    fakeEntranceRepository = new FakeEntranceRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    createEntranceService = new CreateEntranceService(
      fakeEntranceRepository,
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

  it('should be able to create a new entrance', async () => {
    const entrance = await createEntranceService.execute({
      business_id: business.id,
      description: 'New Entrance',
      value: 10.9,
      consume: true,
    });

    expect(entrance).toHaveProperty('id');
  });

  it('should not be able to create a new entrance with business no-exists', async () => {
    await expect(
      createEntranceService.execute({
        business_id: 'business-no-exists',
        description: 'New Entrance',
        value: 10.9,
        consume: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new entrance with description already register in business', async () => {
    const entrance = await createEntranceService.execute({
      business_id: business.id,
      description: 'New Entrance',
      value: 10.9,
      consume: false,
    });

    await expect(
      createEntranceService.execute({
        business_id: business.id,
        description: entrance.description,
        value: 10.9,
        consume: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

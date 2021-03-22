import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeEntranceRepository from '../repositories/fakes/FakeEntranceRepository';
import DeleteEntranceService from './DeleteEntranceService';

let fakeEntranceRepository: FakeEntranceRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let deleteEntranceService: DeleteEntranceService;
let business: { id: string };

describe('DeleteEntrance', () => {
  beforeEach(async () => {
    fakeEntranceRepository = new FakeEntranceRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    deleteEntranceService = new DeleteEntranceService(
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

  it('should be able to delete entrance for id', async () => {
    const deleteById = jest.spyOn(fakeEntranceRepository, 'deleteById');

    const newEntrance = await fakeEntranceRepository.create({
      business_id: business.id,
      description: 'New Entrance',
      value: 10.9,
      consume: false,
    });

    await deleteEntranceService.execute({
      id: newEntrance.id,
      business_id: business.id,
    });

    expect(deleteById).toHaveBeenCalledWith(newEntrance.id, business.id);
  });

  it('should not be able to delete entrance with business no-exists', async () => {
    await expect(
      deleteEntranceService.execute({
        id: 'id-entrance-delete',
        business_id: 'business-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete entrance with entrance no-exists', async () => {
    await expect(
      deleteEntranceService.execute({
        id: 'id-entrance-delete',
        business_id: business.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete entrance with entrance no-exists in business', async () => {
    const businessOne = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business One',
      categories: [{ name: 'bares ' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });

    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business Two',
      categories: [{ name: 'bares ' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });

    const entrance = await fakeEntranceRepository.create({
      business_id: businessOne.id,
      description: 'Description test',
      value: 20,
      consume: true,
    });

    await expect(
      deleteEntranceService.execute({
        id: entrance.id,
        business_id: businessTwo.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

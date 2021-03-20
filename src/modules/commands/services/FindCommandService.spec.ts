import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCommandRepository from '../repositories/fakes/FakeCommandRepository';
import FindCommandService from './FindCommandService';

let fakeCommandRepository: FakeCommandRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let findCommandService: FindCommandService;
let business: { id: string };

describe('FindCommand', () => {
  beforeEach(async () => {
    fakeCommandRepository = new FakeCommandRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    findCommandService = new FindCommandService(
      fakeCommandRepository,
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

  it('should be able to find a command', async () => {
    const newCommand = await fakeCommandRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id',
      number: 100,
    });

    const command = await findCommandService.execute({
      business_id: business.id,
      number: 100,
    });

    expect(command).toBe(newCommand);
  });

  it('should not be able to find a command with business no-exists', async () => {
    await expect(
      findCommandService.execute({
        business_id: 'business-no-exists',
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to list a command with number not found', async () => {
    await expect(
      findCommandService.execute({
        business_id: business.id,
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

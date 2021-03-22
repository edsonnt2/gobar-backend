import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCommandRepository from '../repositories/fakes/FakeCommandRepository';
import AllCommandService from './AllCommandService';

let fakeCommandRepository: FakeCommandRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let allCommandService: AllCommandService;
let business: { id: string };

describe('AllCommand', () => {
  beforeEach(async () => {
    fakeCommandRepository = new FakeCommandRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    allCommandService = new AllCommandService(
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
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to all the commands', async () => {
    const commandOne = await fakeCommandRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id-one',
      number: 100,
    });

    const commandTwo = await fakeCommandRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id-two',
      number: 110,
    });

    const commands = await allCommandService.execute({
      business_id: business.id,
    });

    expect(commands).toStrictEqual([commandOne, commandTwo]);
  });

  it('should not be able to search a command with business no-exists', async () => {
    await expect(
      allCommandService.execute({
        business_id: 'business-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

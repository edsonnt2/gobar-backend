import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCommandRepository from '../repositories/fakes/FakeCommandRepository';
import SearchCommandService from './SearchCommandService';

let fakeCommandRepository: FakeCommandRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let searchCommandService: SearchCommandService;
let business: { id: string };

describe('SearchCommand', () => {
  beforeEach(async () => {
    fakeCommandRepository = new FakeCommandRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    searchCommandService = new SearchCommandService(
      fakeCommandRepository,
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

  it('should be able to search a command', async () => {
    const commandOne = await fakeCommandRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-one',
      number: 100,
    });

    const commandTwo = await fakeCommandRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-two',
      number: 110,
    });

    const commands = await searchCommandService.execute({
      business_id: business.id,
      search: '1',
    });

    expect(commands).toStrictEqual([commandOne, commandTwo]);
  });

  it('should not be able to search a command with business no-exists', async () => {
    await expect(
      searchCommandService.execute({
        business_id: 'business-no-exists',
        search: '1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

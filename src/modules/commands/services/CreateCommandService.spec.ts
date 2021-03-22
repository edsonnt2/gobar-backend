import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCustomerRepository from '@modules/customers/repositories/fakes/FakeCustomerRepository';
import FakeEntranceRepository from '@modules/entrance/repositories/fakes/FakeEntranceRepository';
import FakeCommandRepository from '../repositories/fakes/FakeCommandRepository';
import CreateCommandService from './CreateCommandService';

let fakeCommandRepository: FakeCommandRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeCustomerRepository: FakeCustomerRepository;
let fakeEntranceRepository: FakeEntranceRepository;
let createCommandService: CreateCommandService;
let business: { id: string };
let customer: { id: string };

describe('CreateCommand', () => {
  beforeEach(async () => {
    fakeCommandRepository = new FakeCommandRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeEntranceRepository = new FakeEntranceRepository();
    createCommandService = new CreateCommandService(
      fakeCommandRepository,
      fakeCustomerRepository,
      fakeBusinessRepository,
      fakeEntranceRepository,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10).getTime());

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

    customer = await fakeCustomerRepository.create({
      business_id: business.id,
      name: 'Name Test',
      birthDate: '1991-08-09',
      gender: 'M',
    });
  });

  it('should be able to create a new command', async () => {
    const entrance = await fakeEntranceRepository.create({
      business_id: business.id,
      consume: false,
      description: 'Description Entrance',
      value: 10,
    });

    const command = await createCommandService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 100,
      entrance_id: entrance.id,
      prepaid_entrance: false,
    });

    expect(command).toHaveProperty('id');
  });

  it('should not be able to create a new command with business no-exists', async () => {
    await expect(
      createCommandService.execute({
        business_id: 'business-no-exists',
        user_id: 'operator-id',
        customer_id: customer.id,
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command with customer no-exists', async () => {
    await expect(
      createCommandService.execute({
        business_id: business.id,
        user_id: 'operator-id',
        customer_id: 'customer-no-exists',
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command with customer at the outher business', async () => {
    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business two',
      categories: [{ name: 'bares ' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createCommandService.execute({
        business_id: businessTwo.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command for customer with command already open', async () => {
    await createCommandService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 100,
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        number: 101,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command with number already register in outher command', async () => {
    const command = await createCommandService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 100,
    });

    const customerTwo = await fakeCustomerRepository.create({
      business_id: business.id,
      name: 'Name Test Two',
      birthDate: '1991-08-09',
      gender: 'M',
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        user_id: 'operator-id',
        customer_id: customerTwo.id,
        number: command.number,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command with entrance non-exists', async () => {
    await fakeEntranceRepository.create({
      business_id: business.id,
      consume: false,
      description: 'Description Entrance',
      value: 10,
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        entrance_id: 'entrance-non-exists',
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command with entrance at outher business', async () => {
    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business two',
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
      business_id: businessTwo.id,
      consume: false,
      description: 'Description Entrance',
      value: 10,
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        entrance_id: entrance.id,
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command without informing entrance that is registered', async () => {
    await fakeEntranceRepository.create({
      business_id: business.id,
      consume: false,
      description: 'Description Entrance',
      value: 10,
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCommandRepository from '@modules/commands/repositories/fakes/FakeCommandRepository';
import CreateCommandClosureService from './CreateCommandClosureService';
import FakeCommandClosureRepository from '../repositories/fakes/FakeCommandClosureRepository';

let fakeCommandClosureRepository: FakeCommandClosureRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeCommandRepository: FakeCommandRepository;
let createCommandClosureService: CreateCommandClosureService;
let business: { id: string };
let command: { id: string };

describe('CreateCommandClosure', () => {
  beforeEach(async () => {
    fakeCommandClosureRepository = new FakeCommandClosureRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCommandRepository = new FakeCommandRepository();
    createCommandClosureService = new CreateCommandClosureService(
      fakeCommandClosureRepository,
      fakeBusinessRepository,
      fakeCommandRepository,
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

    command = await fakeCommandRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-one',
      number: 1,
      operator_id: 'operator-id',
    });
  });

  it('should be able to create a command closure', async () => {
    const commandTwo = await fakeCommandRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-two',
      number: 2,
      operator_id: 'operator-id',
    });

    const commandClosure = await createCommandClosureService.execute({
      business_id: business.id,
      user_id: 'operator-id',
      value_total: 100,
      discount: 10,
      command_ids: [command.id, commandTwo.id],
      payment_commands_closure: [
        {
          subtotal: 50,
          type: 'money',
          received: 120,
        },
        {
          subtotal: 40,
          type: 'card',
          type_card: 'visa-debit',
        },
      ],
    });

    expect(commandClosure).toHaveProperty('id');
  });

  it('should not be able to create a command closure with business non-exists', async () => {
    await expect(
      createCommandClosureService.execute({
        business_id: 'business-non-exists',
        command_ids: [command.id],
        user_id: 'operator-id',
        value_total: 100,
        payment_commands_closure: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a command closure with command non-exists', async () => {
    await expect(
      createCommandClosureService.execute({
        business_id: business.id,
        command_ids: [command.id, 'command-non-exists'],
        user_id: 'operator-id',
        value_total: 100,
        payment_commands_closure: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a command closure with type money payment incorrect', async () => {
    await expect(
      createCommandClosureService.execute({
        business_id: business.id,
        command_ids: [command.id],
        user_id: 'operator-id',
        value_total: 100,
        payment_commands_closure: [
          {
            subtotal: 100,
            type: 'money',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a command closure with type card payment incorrect', async () => {
    await expect(
      createCommandClosureService.execute({
        business_id: business.id,
        command_ids: [command.id],
        user_id: 'operator-id',
        value_total: 100,
        payment_commands_closure: [
          {
            subtotal: 100,
            type: 'card',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

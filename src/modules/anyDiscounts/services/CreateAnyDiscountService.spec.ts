import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCommandRepository from '@modules/commands/repositories/fakes/FakeCommandRepository';
import FakeTableRepository from '@modules/tables/repositories/fakes/FakeTableRepository';
import FakeAnyDiscountRepository from '../repositories/fakes/FakeAnyDiscountRepository';
import CreateAnyDiscountService from './CreateAnyDiscountService';

let fakeAnyDiscountRepository: FakeAnyDiscountRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeCommandRepository: FakeCommandRepository;
let fakeTableRepository: FakeTableRepository;
let createAnyDiscountService: CreateAnyDiscountService;
let business: { id: string };
let command: { id: string };
let table: { id: string };

describe('CreateAnyDiscount', () => {
  beforeEach(async () => {
    fakeAnyDiscountRepository = new FakeAnyDiscountRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCommandRepository = new FakeCommandRepository();
    fakeTableRepository = new FakeTableRepository();
    createAnyDiscountService = new CreateAnyDiscountService(
      fakeAnyDiscountRepository,
      fakeBusinessRepository,
      fakeCommandRepository,
      fakeTableRepository,
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

    command = await fakeCommandRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-one',
      number: 1,
      operator_id: 'operator-id',
    });

    table = await fakeTableRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-one',
      number: 1,
      operator_id: 'operator-id',
    });
  });

  it('should be able to create a discount for command', async () => {
    const discount = await createAnyDiscountService.execute({
      business_id: business.id,
      user_id: 'operator-id',
      value_total: 100,
      discount: 10,
      command_id: command.id,
      payment_discount: [
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

    expect(discount).toHaveProperty('id');
  });

  it('should be able to create a discount for table', async () => {
    const discount = await createAnyDiscountService.execute({
      business_id: business.id,
      user_id: 'operator-id',
      value_total: 100,
      discount: 10,
      table_id: table.id,
      payment_discount: [
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

    expect(discount).toHaveProperty('id');
  });

  it('should not be able to create a discount with command or table non-exists', async () => {
    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with business non-exists', async () => {
    await expect(
      createAnyDiscountService.execute({
        business_id: 'business-non-exists',
        command_id: command.id,
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with command incorrenct', async () => {
    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        command_id: 'command-incorrect',
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with table incorrenct', async () => {
    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        table_id: 'table-incorrect',
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with command outher business', async () => {
    const commandTwo = await fakeCommandRepository.create({
      business_id: 'outher-business',
      customer_id: 'customer-id-one',
      number: 2,
      operator_id: 'operator-id',
    });

    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        command_id: commandTwo.id,
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with table outher business', async () => {
    const tableTwo = await fakeTableRepository.create({
      business_id: 'outher-business',
      customer_id: 'customer-id-one',
      number: 2,
      operator_id: 'operator-id',
    });

    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        table_id: tableTwo.id,
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with type money payment incorrect', async () => {
    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        command_id: command.id,
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'money',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a discount with type card payment incorrect', async () => {
    await expect(
      createAnyDiscountService.execute({
        business_id: business.id,
        command_id: command.id,
        user_id: 'operator-id',
        value_total: 100,
        payment_discount: [
          {
            subtotal: 100,
            type: 'card',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

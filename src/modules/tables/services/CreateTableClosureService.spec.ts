import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeTableRepository from '@modules/tables/repositories/fakes/FakeTableRepository';
import CreateTableClosureService from './CreateTableClosureService';
import FakeTableClosureRepository from '../repositories/fakes/FakeTableClosureRepository';

let fakeTableClosureRepository: FakeTableClosureRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeTableRepository: FakeTableRepository;
let createTableClosureService: CreateTableClosureService;
let business: { id: string };
let table: { id: string };

describe('CreateTableClosure', () => {
  beforeEach(async () => {
    fakeTableClosureRepository = new FakeTableClosureRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeTableRepository = new FakeTableRepository();
    createTableClosureService = new CreateTableClosureService(
      fakeTableClosureRepository,
      fakeBusinessRepository,
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

    table = await fakeTableRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-one',
      number: 1,
      operator_id: 'operator-id',
    });
  });

  it('should be able to create a table closure', async () => {
    const tableTwo = await fakeTableRepository.create({
      business_id: business.id,
      customer_id: 'customer-id-two',
      number: 2,
      operator_id: 'operator-id',
    });

    const tableClosure = await createTableClosureService.execute({
      business_id: business.id,
      user_id: 'operator-id',
      value_total: 100,
      discount: 10,
      table_ids: [table.id, tableTwo.id],
      payment_tables_closure: [
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

    expect(tableClosure).toHaveProperty('id');
  });

  it('should not be able to create a table closure with business non-exists', async () => {
    await expect(
      createTableClosureService.execute({
        business_id: 'business-non-exists',
        table_ids: [table.id],
        user_id: 'operator-id',
        value_total: 100,
        payment_tables_closure: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a table closure with table non-exists', async () => {
    await expect(
      createTableClosureService.execute({
        business_id: business.id,
        table_ids: [table.id, 'table-non-exists'],
        user_id: 'operator-id',
        value_total: 100,
        payment_tables_closure: [
          {
            subtotal: 100,
            type: 'money',
            received: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a table closure with type money payment incorrect', async () => {
    await expect(
      createTableClosureService.execute({
        business_id: business.id,
        table_ids: [table.id],
        user_id: 'operator-id',
        value_total: 100,
        payment_tables_closure: [
          {
            subtotal: 100,
            type: 'money',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a table closure with type card payment incorrect', async () => {
    await expect(
      createTableClosureService.execute({
        business_id: business.id,
        table_ids: [table.id],
        user_id: 'operator-id',
        value_total: 100,
        payment_tables_closure: [
          {
            subtotal: 100,
            type: 'card',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

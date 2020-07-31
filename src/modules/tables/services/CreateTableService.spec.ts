import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCustomerRepository from '@modules/customers/repositories/fakes/FakeCustomerRepository';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import CreateTableService from './CreateTableService';

let fakeTableRepository: FakeTableRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeCustomerRepository: FakeCustomerRepository;
let createTableService: CreateTableService;
let business: { id: string };
let customer: { id: string };

describe('CreateTable', () => {
  beforeEach(async () => {
    fakeTableRepository = new FakeTableRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCustomerRepository = new FakeCustomerRepository();
    createTableService = new CreateTableService(
      fakeTableRepository,
      fakeCustomerRepository,
      fakeBusinessRepository,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10).getTime());

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

    customer = await fakeCustomerRepository.create({
      business_id: business.id,
      name: 'Name Test',
      birthDate: '1991-08-09',
      gender: 'M',
    });
  });

  it('should be able to create a new table', async () => {
    const table = await createTableService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 1,
    });

    expect(table).toHaveProperty('id');
  });

  it('should be able to create a table with number already register for outher customer', async () => {
    const table = await createTableService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 1,
    });

    const customerTwo = await fakeCustomerRepository.create({
      business_id: business.id,
      name: 'Name Test Two',
      birthDate: '1991-08-09',
      gender: 'M',
    });

    const tableWithOutherCustomer = await createTableService.execute({
      business_id: business.id,
      user_id: 'operator-id',
      customer_id: customerTwo.id,
      number: table.number,
    });

    expect(tableWithOutherCustomer.table_customer).toEqual([
      expect.objectContaining({
        table_id: tableWithOutherCustomer.id,
        customer_id: customer.id,
      }),
      expect.objectContaining({
        table_id: tableWithOutherCustomer.id,
        customer_id: customerTwo.id,
      }),
    ]);
  });

  it('should not be able to create a new table with business no-exists', async () => {
    await expect(
      createTableService.execute({
        business_id: 'business-no-exists',
        user_id: 'operator-id',
        number: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new table with customer incorrect', async () => {
    await expect(
      createTableService.execute({
        business_id: business.id,
        user_id: 'operator-id',
        customer_id: 'customer-no-exists',
        number: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new table with customer at the outher business', async () => {
    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business two',
      categories: [{ name: 'bares ' }],
      cpf_or_cnpj: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createTableService.execute({
        business_id: businessTwo.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        number: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new table for customer with table already open', async () => {
    await createTableService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 1,
    });

    await expect(
      createTableService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        number: 2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a table with number already register without outher customer', async () => {
    const table = await createTableService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 1,
    });

    await expect(
      createTableService.execute({
        business_id: business.id,
        user_id: 'operator-id',
        number: table.number,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

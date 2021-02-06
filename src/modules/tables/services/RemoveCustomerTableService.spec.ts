import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import RemoveCustomerTableService from './RemoveCustomerTableService';

let fakeTableRepository: FakeTableRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let removeCustomerTableService: RemoveCustomerTableService;
let business: { id: string };

describe('RemoveCustomerTable', () => {
  beforeEach(async () => {
    fakeTableRepository = new FakeTableRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    removeCustomerTableService = new RemoveCustomerTableService(
      fakeTableRepository,
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

  it('should be able to remove customer a table', async () => {
    const removeCustomerSpy = jest.spyOn(fakeTableRepository, 'removeCustomer');

    const newTable = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id',
      number: 1,
    });

    const table = await removeCustomerTableService.execute({
      business_id: business.id,
      customer_id: 'customer-id',
      table_id: newTable.id,
    });

    expect(table).toBe(newTable);
    expect(removeCustomerSpy).toBeCalledTimes(1);
  });

  it('should not be able to remove customer a table with business no-exists', async () => {
    await expect(
      removeCustomerTableService.execute({
        business_id: 'business-no-exists',
        customer_id: 'customer-id',
        table_id: 'table-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to remove customer a table with customer id non-exists', async () => {
    await expect(
      removeCustomerTableService.execute({
        business_id: business.id,
        customer_id: 'customer-id',
        table_id: 'table-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to remove customer a table than outher business', async () => {
    const businessTwo = await fakeBusinessRepository.create({
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

    const newTable = await fakeTableRepository.create({
      business_id: businessTwo.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id',
      number: 1,
    });

    await expect(
      removeCustomerTableService.execute({
        business_id: business.id,
        customer_id: 'customer-id',
        table_id: newTable.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to remove customer a table with customer id non-exists', async () => {
    const newTable = await fakeTableRepository.create({
      business_id: business.id,
      operator_id: 'operator-id',
      customer_id: 'customer-id',
      number: 1,
    });

    await expect(
      removeCustomerTableService.execute({
        business_id: business.id,
        customer_id: 'outher-customer-id',
        table_id: newTable.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

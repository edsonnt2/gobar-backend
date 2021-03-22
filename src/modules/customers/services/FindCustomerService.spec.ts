import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCustomerRepository from '../repositories/fakes/FakeCustomerRepository';
import FindCustomerService from './FIndCustomerService';

let fakeCustomerRepository: FakeCustomerRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let findCustomerService: FindCustomerService;
let business: { id: string };

describe('FindCustomer', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    findCustomerService = new FindCustomerService(
      fakeCustomerRepository,
      fakeBusinessRepository,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10).getTime());

    business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to find customer in business', async () => {
    const customer = await fakeCustomerRepository.create({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: 12999999099,
      birthDate: '1991/09/08',
      gender: 'M',
    });

    const findCustomer = await findCustomerService.execute({
      customer_id: customer.id,
      business_id: business.id,
    });

    expect(findCustomer.id).toEqual(customer.id);
  });

  it('should be able to find customer in outher business', async () => {
    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business Two',
      categories: [{ name: 'bares' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });

    const customer = await fakeCustomerRepository.create({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: 12999999099,
      birthDate: '1991/09/08',
      gender: 'M',
    });

    const findCustomer = await findCustomerService.execute({
      customer_id: customer.id,
      business_id: businessTwo.id,
    });

    expect(findCustomer.id).toEqual(customer.id);
  });

  it('should not be able to find customer with business non-exists', async () => {
    await expect(
      findCustomerService.execute({
        business_id: 'business-non-exists-id',
        customer_id: 'customer-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to find customer with customer non-exists', async () => {
    await expect(
      findCustomerService.execute({
        business_id: business.id,
        customer_id: 'customer-non-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

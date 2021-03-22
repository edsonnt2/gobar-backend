import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import SearchCustomerService from './SearchCustomerService';
import FakeCustomerRepository from '../repositories/fakes/FakeCustomerRepository';

let fakeBusinessRepository: FakeBusinessRepository;
let fakeCustomerRepository: FakeCustomerRepository;
let searchCustomerService: SearchCustomerService;

describe('SearchCustomer', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    searchCustomerService = new SearchCustomerService(
      fakeCustomerRepository,
      fakeBusinessRepository,
    );
  });

  it('should be able to search for customer', async () => {
    const business = await fakeBusinessRepository.create({
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

    const customers = await searchCustomerService.execute({
      business_id: business.id,
      search: 'Name Test',
    });

    expect(customers).toHaveProperty('users');
    expect(customers).toHaveProperty('customersInBusiness');
    expect(customers).toHaveProperty('customersOutherBusiness');
  });

  it('should not be able to search with business no-exists', async () => {
    await expect(
      searchCustomerService.execute({
        business_id: 'business-no-exists',
        search: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCpfAndCnpjProvider from '@shared/provider/CpfOrCnpjProvider/fakes/FakeCpfAndCnpjProvider';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomerRepository from '../repositories/fakes/FakeCustomerRepository';

let fakeCustomerRepository: FakeCustomerRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeUserRepository: FakeUserRepository;
let fakeCpfAndCnpjProvider: FakeCpfAndCnpjProvider;
let createCustomerService: CreateCustomerService;
let business: { id: string };

describe('CreateCustomer', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeUserRepository = new FakeUserRepository();
    fakeCpfAndCnpjProvider = new FakeCpfAndCnpjProvider();
    createCustomerService = new CreateCustomerService(
      fakeCustomerRepository,
      fakeBusinessRepository,
      fakeUserRepository,
      fakeCpfAndCnpjProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10).getTime());

    business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares' }],
      cpf_or_cnpj: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to create and updated a customer', async () => {
    const customer = await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '12999999099',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    const updateCustomer = await createCustomerService.execute({
      customer_id: customer.id,
      business_id: business.id,
      name: 'Full Name Test',
      email: 'test@test.com',
      birthDate: '1991/09/08',
      gender: 'M',
      cpf_or_cnpj: '123.456.789-09',
    });

    expect(customer).toHaveProperty('id');
    expect(updateCustomer.cpf_or_cnpj).toEqual(12345678909);
  });

  it('should be able to create and updated a customer with outher business', async () => {
    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'outher-user-id',
      name: 'New Business Two',
      categories: [{ name: 'bares' }],
      cpf_or_cnpj: 88978623064,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    const customer = await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '12999999099',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    const updateCustomer = await createCustomerService.execute({
      customer_id: customer.id,
      business_id: businessTwo.id,
      name: 'Full Name Test',
      email: 'test@test.com',
      birthDate: '1991/09/08',
      gender: 'M',
      cpf_or_cnpj: '123.456.789-09',
    });

    expect(customer).toHaveProperty('id');
    expect(updateCustomer.cpf_or_cnpj).toEqual(12345678909);
  });

  it('should not be able to create customer with business non-exists', async () => {
    await expect(
      createCustomerService.execute({
        business_id: 'business-non-exists',
        name: 'Full Name Test',
        cell_phone: '12999999099',
        birthDate: '1991/09/08',
        gender: 'M',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create customer without name, birthDate and gender non-exists', async () => {
    await expect(
      createCustomerService.execute({
        business_id: business.id,
        cell_phone: '12999999099',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a updated with and cell phone already registered', async () => {
    const customer = await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '(19) 99999-9999',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    const updateCustomer = await createCustomerService.execute({
      customer_id: customer.id,
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '(19) 99999-9999',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    expect(updateCustomer).toBe(customer);
  });

  it('should be able to create a updated with and email already registered', async () => {
    const customer = await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    const updateCustomer = await createCustomerService.execute({
      customer_id: customer.id,
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '(19) 99999-9999',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    expect(updateCustomer).toBe(customer);
  });

  it('should not be able to create a new account with cell_phone already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      email: 'test@mail.com',
      cell_phone: '(19) 99999-9999',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        cell_phone: '(19) 99999-9999',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new account with cell_phone already registered at one user', async () => {
    await fakeUserRepository.create({
      name: 'Name Test',
      cell_phone: 19999999999,
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      password: '123456',
    });

    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        cell_phone: '(19) 99999-9999',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new account with email already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new account with email already registered at one user', async () => {
    await fakeUserRepository.create({
      name: 'Name Test',
      cell_phone: 19999999994,
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      password: '123456',
    });

    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        cell_phone: '(19) 99999-9999',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with cell_phone already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '(19) 99999-9999',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        customer_id: 'outher-customer-id',
        business_id: business.id,
        name: 'Full Name Test',
        cell_phone: '(19) 99999-9999',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with cpf already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '(19) 99999-9999',
      cpf_or_cnpj: '12345678909',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        cpf_or_cnpj: '12345678909',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with cnpj already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      cell_phone: '(19) 99999-9999',
      cpf_or_cnpj: '51874860073230',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        cpf_or_cnpj: '51874860073230',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with email already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      email: 'test@mail.com',
      birthDate: '1991/09/08',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        customer_id: 'outher-customer-id',
        business_id: business.id,
        name: 'Full Name Test',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with cpf already registered for outher customer', async () => {
    await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      birthDate: '1991/09/08',
      cpf_or_cnpj: '12345678909',
      gender: 'M',
    });

    await expect(
      createCustomerService.execute({
        customer_id: 'outher-customer-id',
        business_id: business.id,
        name: 'Full Name Test',
        cpf_or_cnpj: '12345678909',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update with cnpj already registered', async () => {
    const customer = await createCustomerService.execute({
      business_id: business.id,
      name: 'Full Name Test',
      birthDate: '1991/09/08',
      cpf_or_cnpj: '51874860073230',
      gender: 'M',
    });

    const customerTwo = await createCustomerService.execute({
      customer_id: customer.id,
      business_id: business.id,
      name: 'Full Name Test',
      cpf_or_cnpj: '51874860073230',
      birthDate: '1991/09/08',
      gender: 'W',
    });

    expect(customer).toBe(customerTwo);
  });

  it('should not be able to create an account with cpf invalid.', async () => {
    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        email: 'test@mail.com',
        cpf_or_cnpj: 'cpf-invalid',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a customer with customer non-exists.', async () => {
    await expect(
      createCustomerService.execute({
        customer_id: 'customer-non-exists',
        business_id: business.id,
        name: 'Full Name Test',
        email: 'test@mail.com',
        birthDate: '1991/09/08',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a customer with birthDate invalid.', async () => {
    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        email: 'test@mail.com',
        birthDate: 'birthDate-invalid',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a customer for under the age of 16.', async () => {
    await expect(
      createCustomerService.execute({
        business_id: business.id,
        name: 'Full Name Test',
        cell_phone: '12999999999',
        email: 'test@test.com',
        birthDate: '2004/5/20',
        gender: 'W',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

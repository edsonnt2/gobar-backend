import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import CreateBusinessService from './CreateBusinessService';
import FakeBusinessRepository from '../repositories/fakes/FakeBusinessRepository';
import FakeCpfAndCnpjProvider from '../provider/fakes/FakeCpfAndCnpjProvider';

let fakeBusinessRepository: FakeBusinessRepository;
let fakeCpfAndCnpjProvider: FakeCpfAndCnpjProvider;
let createBusinessService: CreateBusinessService;

describe('CreateBusiness', () => {
  beforeEach(() => {
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCpfAndCnpjProvider = new FakeCpfAndCnpjProvider();
    createBusinessService = new CreateBusinessService(
      fakeBusinessRepository,
      fakeCpfAndCnpjProvider,
    );
  });

  it('should be able to create a new business', async () => {
    const business = await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cell_phone: '(19) 99999-9999',
      phone: '(19) 3333-3333',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      complement: 'Complement Test',
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    expect(business).toHaveProperty('id');
  });

  it('should be able to create a new business without informing cell phone, phone or complement', async () => {
    const business = await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    expect(business).toHaveProperty('id');
  });

  it('should not be able to create a new business with name already registered', async () => {
    await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cell_phone: '(19) 99999-9999',
      phone: '(19) 3333-3333',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      complement: 'Complement Test',
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createBusinessService.execute({
        user_id: 'user-id',
        name: 'New Business',
        category: 'bares',
        cell_phone: '(19) 99999-9999',
        phone: '(19) 3333-3333',
        cpf_or_cnpj: '889.786.230-69',
        zip_code: '99999-999',
        number: 9,
        complement: 'Complement Test',
        street: 'Rua test',
        district: 'District Test',
        city: 'City Test',
        state: 'State Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new business with cell phone already registered for another user', async () => {
    await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cell_phone: '(19) 99999-9999',
      phone: '(19) 3333-3333',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      complement: 'Complement Test',
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createBusinessService.execute({
        user_id: 'other-user-id',
        name: 'New Business Two',
        category: 'bares',
        cell_phone: '(19) 99999-9999',
        phone: '(19) 3333-3333',
        cpf_or_cnpj: '889.786.230-69',
        zip_code: '99999-999',
        number: 9,
        complement: 'Complement Test',
        street: 'Rua test',
        district: 'District Test',
        city: 'City Test',
        state: 'State Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new business with phone already registered for another user', async () => {
    await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cell_phone: '(19) 99999-9996',
      phone: '(19) 3333-3333',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      complement: 'Complement Test',
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createBusinessService.execute({
        user_id: 'other-user-id',
        name: 'New Business Two',
        category: 'bares',
        cell_phone: 'other-cell-phone-number',
        phone: '(19) 3333-3333',
        cpf_or_cnpj: '889.786.230-69',
        zip_code: '99999-999',
        number: 9,
        complement: 'Complement Test',
        street: 'Rua test',
        district: 'District Test',
        city: 'City Test',
        state: 'State Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new business with invalid cpf or cnpj', async () => {
    await expect(
      createBusinessService.execute({
        user_id: 'user-id',
        name: 'New Business',
        category: 'bares',
        cell_phone: '(19) 99999-9996',
        phone: '(19) 3333-3333',
        cpf_or_cnpj: 'invalid-cpf-or-cnpj',
        zip_code: '99999-999',
        number: 9,
        complement: 'Complement Test',
        street: 'Rua test',
        district: 'District Test',
        city: 'City Test',
        state: 'State Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new business with cpf already registered for another user', async () => {
    await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cell_phone: '(19) 99999-9996',
      phone: '(19) 3333-3333',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      complement: 'Complement Test',
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createBusinessService.execute({
        user_id: 'outher-user-id',
        name: 'New Business Two',
        category: 'bares',
        cell_phone: 'other-cell-phone-number',
        phone: 'other-phone-number',
        cpf_or_cnpj: '889.786.230-69',
        zip_code: '99999-999',
        number: 9,
        complement: 'Complement Test',
        street: 'Rua test',
        district: 'District Test',
        city: 'City Test',
        state: 'State Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new business with cpnj already registered for another business', async () => {
    await createBusinessService.execute({
      user_id: 'user-id',
      name: 'New Business',
      category: 'bares',
      cell_phone: '(19) 99999-9996',
      phone: '(19) 3333-3333',
      cpf_or_cnpj: '51874860073230',
      zip_code: '99999-999',
      number: 9,
      complement: 'Complement Test',
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      createBusinessService.execute({
        user_id: 'outher-user-id',
        name: 'New Business Two',
        category: 'bares',
        cell_phone: 'other-cell-phone-number',
        phone: 'other-phone-number',
        cpf_or_cnpj: '51874860073230',
        zip_code: '99999-999',
        number: 9,
        complement: 'Complement Test',
        street: 'Rua test',
        district: 'District Test',
        city: 'City Test',
        state: 'State Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

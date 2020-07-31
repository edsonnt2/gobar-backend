import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeCustomerRepository from '@modules/customers/repositories/fakes/FakeCustomerRepository';
import FakeIngressRepository from '@modules/ingress/repositories/fakes/FakeIngressRepository';
import FakeCommandRepository from '../repositories/fakes/FakeCommandRepository';
import CreateCommandService from './CreateCommandService';

let fakeCommandRepository: FakeCommandRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeCustomerRepository: FakeCustomerRepository;
let fakeIngressRepository: FakeIngressRepository;
let createCommandService: CreateCommandService;
let business: { id: string };
let customer: { id: string };

describe('CreateCommand', () => {
  beforeEach(async () => {
    fakeCommandRepository = new FakeCommandRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeIngressRepository = new FakeIngressRepository();
    createCommandService = new CreateCommandService(
      fakeCommandRepository,
      fakeCustomerRepository,
      fakeBusinessRepository,
      fakeIngressRepository,
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

  it('should be able to create a new command', async () => {
    const ingress = await fakeIngressRepository.create({
      business_id: business.id,
      consume: false,
      description: 'Description Ingress',
      value: 10,
    });

    const command = await createCommandService.execute({
      business_id: business.id,
      customer_id: customer.id,
      user_id: 'operator-id',
      number: 100,
      ingress_id: ingress.id,
      prepaid_ingress: false,
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
      cpf_or_cnpj: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
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

  it('should not be able to create a new command with ingress non-exists', async () => {
    await fakeIngressRepository.create({
      business_id: business.id,
      consume: false,
      description: 'Description Ingress',
      value: 10,
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        ingress_id: 'ingress-non-exists',
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command with ingress at outher business', async () => {
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

    const ingress = await fakeIngressRepository.create({
      business_id: businessTwo.id,
      consume: false,
      description: 'Description Ingress',
      value: 10,
    });

    await expect(
      createCommandService.execute({
        business_id: business.id,
        customer_id: customer.id,
        user_id: 'operator-id',
        ingress_id: ingress.id,
        number: 100,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new command without informing ingress that is registered', async () => {
    await fakeIngressRepository.create({
      business_id: business.id,
      consume: false,
      description: 'Description Ingress',
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

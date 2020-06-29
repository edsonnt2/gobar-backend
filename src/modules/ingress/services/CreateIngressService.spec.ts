import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeIngressRepository from '../repositories/fakes/FakeIngressRepository';
import CreateIngressService from './CreateIngressService';

let fakeIngressRepository: FakeIngressRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let createIngressService: CreateIngressService;
let business: { id: string };

describe('CreateIngress', () => {
  beforeEach(async () => {
    fakeIngressRepository = new FakeIngressRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    createIngressService = new CreateIngressService(
      fakeIngressRepository,
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

  it('should be able to create a new ingress', async () => {
    const ingress = await createIngressService.execute({
      business_id: business.id,
      description: 'New Ingress',
      value: 10.9,
      consume: true,
    });

    expect(ingress).toHaveProperty('id');
  });

  it('should not be able to create a new ingress with business no-exists', async () => {
    await expect(
      createIngressService.execute({
        business_id: 'business-no-exists',
        description: 'New Ingress',
        value: 10.9,
        consume: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new ingress with description already register in business', async () => {
    const ingress = await createIngressService.execute({
      business_id: business.id,
      description: 'New Ingress',
      value: 10.9,
      consume: false,
    });

    await expect(
      createIngressService.execute({
        business_id: business.id,
        description: ingress.description,
        value: 10.9,
        consume: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

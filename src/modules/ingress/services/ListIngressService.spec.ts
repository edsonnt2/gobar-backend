import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeIngressRepository from '../repositories/fakes/FakeIngressRepository';
import ListIngressService from './ListIngressService';

let fakeIngressRepository: FakeIngressRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let listIngressService: ListIngressService;

describe('ListIngress', () => {
  beforeEach(() => {
    fakeIngressRepository = new FakeIngressRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    listIngressService = new ListIngressService(
      fakeIngressRepository,
      fakeBusinessRepository,
    );
  });

  it('should be able to list all ingress', async () => {
    const business = await fakeBusinessRepository.create({
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

    const newIngress = await fakeIngressRepository.create({
      business_id: business.id,
      description: 'New Ingress',
      value: 10.9,
      consume: false,
    });

    const ingress = await listIngressService.execute({
      business_id: business.id,
    });

    expect(ingress).toEqual([newIngress]);
  });
  it('should not be able to list all ingress with business no-exists', async () => {
    await expect(
      listIngressService.execute({
        business_id: 'business-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

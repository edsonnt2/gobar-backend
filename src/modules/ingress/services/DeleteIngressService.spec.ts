import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeIngressRepository from '../repositories/fakes/FakeIngressRepository';
import DeleteIngressService from './DeleteIngressService';

let fakeIngressRepository: FakeIngressRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let deleteIngressService: DeleteIngressService;

describe('DeleteIngress', () => {
  beforeEach(() => {
    fakeIngressRepository = new FakeIngressRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    deleteIngressService = new DeleteIngressService(
      fakeIngressRepository,
      fakeBusinessRepository,
    );
  });

  it('should be able to delete ingress for id', async () => {
    const deleteById = jest.spyOn(fakeIngressRepository, 'deleteById');

    const business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares ' }],
      cpf_or_cnpj: '889.786.230-69',
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

    await deleteIngressService.execute({
      id: newIngress.id,
      business_id: business.id,
    });

    expect(deleteById).toHaveBeenCalledWith(newIngress.id, business.id);
  });

  it('should not be able to delete ingress with business no-exists', async () => {
    await expect(
      deleteIngressService.execute({
        id: 'id-ingress-delete',
        business_id: 'business-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete ingress with ingress no-exists', async () => {
    const business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares ' }],
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      deleteIngressService.execute({
        id: 'id-ingress-delete',
        business_id: business.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete ingress with ingress no-exists in business', async () => {
    const businessOne = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business One',
      categories: [{ name: 'bares ' }],
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    const businessTwo = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business Two',
      categories: [{ name: 'bares ' }],
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    const ingress = await fakeIngressRepository.create({
      business_id: businessOne.id,
      description: 'Description test',
      value: 20,
      consume: true,
    });

    await expect(
      deleteIngressService.execute({
        id: ingress.id,
        business_id: businessTwo.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

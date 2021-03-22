import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import FindProductService from './FindProductService';

let fakeProductRepository: FakeProductRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let findProductService: FindProductService;
let business: { id: string };

describe('FindProduct', () => {
  beforeEach(async () => {
    fakeProductRepository = new FakeProductRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    findProductService = new FindProductService(
      fakeProductRepository,
      fakeBusinessRepository,
    );

    business = await fakeBusinessRepository.create({
      user_id: 'user-id',
      name: 'New Business',
      categories: [{ name: 'bares ' }],
      taxId: 88978623069,
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      neighborhood: 'Neighborhood Test',
      city: 'City Test',
      state: 'State Test',
    });
  });

  it('should be able to find a product.', async () => {
    const newProduct = await fakeProductRepository.create({
      business_id: business.id,
      description: 'Test Description',
      label_description: 'test description',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: 'A10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      sale_value: 120.0,
      porcent: 20,
    });

    const product = await findProductService.execute({
      business_id: business.id,
      internal_code: 'á10',
    });

    expect(product).toBe(newProduct);
  });

  it('should be able to find the undefined product.', async () => {
    const product = await findProductService.execute({
      business_id: business.id,
      internal_code: 'A10',
    });

    expect(product).toEqual(undefined);
  });

  it('should not be able to find product with business non-exists.', async () => {
    await expect(
      findProductService.execute({
        business_id: 'non-existis-business',
        internal_code: 'a10',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

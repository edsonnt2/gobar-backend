import AppError from '@shared/error/AppError';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import SearchProductService from './SearchProductService';

let fakeProductRepository: FakeProductRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let searchProductService: SearchProductService;
let business: { id: string };

describe('SearchProductProduct', () => {
  beforeEach(async () => {
    fakeProductRepository = new FakeProductRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    searchProductService = new SearchProductService(
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
      district: 'District Test',
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

    const product = await searchProductService.execute({
      business_id: business.id,
      search: 'test',
    });

    expect(product).toEqual([newProduct]);
  });

  it('should not be able to find product with business non-exists.', async () => {
    await expect(
      searchProductService.execute({
        business_id: 'non-existis-business',
        search: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

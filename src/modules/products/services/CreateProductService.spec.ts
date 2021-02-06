import AppError from '@shared/error/AppError';
import FakeStorageProvider from '@shared/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeBusinessRepository from '@modules/business/repositories/fakes/FakeBusinessRepository';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import CreateProductService from './CreateProductService';

let fakeProductRepository: FakeProductRepository;
let fakeBusinessRepository: FakeBusinessRepository;
let fakeStorageProvider: FakeStorageProvider;
let createProductService: CreateProductService;
let business: { id: string };

describe('CreateBusiness', () => {
  beforeEach(async () => {
    fakeProductRepository = new FakeProductRepository();
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createProductService = new CreateProductService(
      fakeProductRepository,
      fakeBusinessRepository,
      fakeStorageProvider,
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

  it('should be able to create a new product', async () => {
    const saveFile = jest.spyOn(fakeStorageProvider, 'saveFile');

    const product = await createProductService.execute({
      image: 'image-product.jpg',
      business_id: business.id,
      description: 'Product Fictitious',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      sale_value: 120.0,
      porcent: 20,
    });

    expect(product).toHaveProperty('id');
    expect(saveFile).toHaveBeenCalledWith('image-product.jpg');
  });

  it('should be able to create a new product without the image.', async () => {
    const product = await createProductService.execute({
      business_id: business.id,
      description: 'Product Fictitious',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      pushase_value: 100.0,
      sale_value: 120.0,
    });

    expect(product).toHaveProperty('id');
  });

  it('should not be able to create a new product with business no-exists', async () => {
    await expect(
      createProductService.execute({
        business_id: 'business-no-exists',
        description: 'Product Fictitious',
        category: 'Drinks',
        provider: 'Coca-cola',
        internal_code: '10',
        quantity: 10,
        barcode: '9405804287539004444',
        pushase_value: 100.0,
        porcent: 20,
        sale_value: 120.0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new product with description already registered', async () => {
    await createProductService.execute({
      business_id: business.id,
      description: 'Product Fictitious',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      porcent: 20,
      sale_value: 120.0,
    });

    await expect(
      createProductService.execute({
        business_id: business.id,
        description: 'Product Fictitious',
        category: 'Drinks',
        provider: 'Coca-cola',
        internal_code: '10',
        quantity: 10,
        barcode: '9405804287539004444',
        pushase_value: 100.0,
        porcent: 20,
        sale_value: 120.0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new product with internal code already registered', async () => {
    await createProductService.execute({
      business_id: business.id,
      description: 'Product Fictitious One',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      porcent: 20,
      sale_value: 120.0,
    });

    await expect(
      createProductService.execute({
        business_id: business.id,
        description: 'Product Fictitious Two',
        category: 'Drinks',
        provider: 'Coca-cola',
        internal_code: '10',
        quantity: 10,
        barcode: '9405804287539004444',
        pushase_value: 100.0,
        porcent: 20,
        sale_value: 120.0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new product with barcode already registered', async () => {
    await createProductService.execute({
      business_id: business.id,
      description: 'Product Fictitious One',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      porcent: 20,
      sale_value: 120.0,
    });

    await expect(
      createProductService.execute({
        business_id: business.id,
        description: 'Product Fictitious Two',
        category: 'Foods',
        provider: 'Coca-cola',
        internal_code: '20',
        quantity: 10,
        barcode: '9405804287539004444',
        pushase_value: 100.0,
        porcent: 20,
        sale_value: 120.0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

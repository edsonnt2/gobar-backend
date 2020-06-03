import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeStorageProvider from '@shared/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import CreateProductService from './CreateProductService';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeStorageProvider: FakeStorageProvider;
let createProductService: CreateProductService;

describe('CreateBusiness', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeStorageProvider = new FakeStorageProvider();
    createProductService = new CreateProductService(
      fakeProductRepository,
      fakeCacheProvider,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new product', async () => {
    const product = await createProductService.execute({
      business_id: 'business-id',
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

  it('should be able to create a new product with the image.', async () => {
    const removeCache = jest.spyOn(fakeCacheProvider, 'remove');
    await fakeCacheProvider.save('image-tmp-product:business-id', 'image.jpg');

    const product = await createProductService.execute({
      business_id: 'business-id',
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

    expect(product).toHaveProperty('id');
    expect(removeCache).toHaveBeenCalledWith('image-tmp-product:business-id');
  });

  it('should not be able to create a new product with description already registered', async () => {
    await createProductService.execute({
      business_id: 'business-id',
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
        business_id: 'business-id',
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
      business_id: 'business-id',
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
        business_id: 'business-id',
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
      business_id: 'business-id',
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
        business_id: 'business-id',
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

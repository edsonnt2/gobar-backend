import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeStorageProvider from '@shared/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import UpdateImageProductService from './UpdateImageProductService';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeStorageProvider: FakeStorageProvider;
let updateImageProductService: UpdateImageProductService;

describe('UpdatedimageBusiness', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeStorageProvider = new FakeStorageProvider();
    updateImageProductService = new UpdateImageProductService(
      fakeProductRepository,
      fakeCacheProvider,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar without product', async () => {
    const imageProduct = await updateImageProductService.execute({
      business_id: 'business-id',
      imageFilename: 'image.jpg',
    });

    expect(imageProduct.image).toBe('image.jpg');
  });

  it('should be able to update image with product', async () => {
    const product = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Description Product',
      provider: 'Coca-cola',
      category: 'drinks',
      internal_code: '100',
      quantity: 10,
      pushase_value: 10.99,
      sale_value: 10.99,
    });

    const imageProduct = await updateImageProductService.execute({
      business_id: 'business-id',
      product_id: product.id,
      imageFilename: 'image.jpg',
    });

    expect(imageProduct).toBe(product);
  });

  it('should not be able to update image with non-existing-product ', async () => {
    await expect(
      updateImageProductService.execute({
        business_id: 'business-id',
        product_id: 'non-existing-product',
        imageFilename: 'image.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update image and removed old image', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const product = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Description Product',
      provider: 'Coca-cola',
      category: 'drinks',
      internal_code: '100',
      quantity: 10,
      pushase_value: 10.99,
      sale_value: 10.99,
    });

    await updateImageProductService.execute({
      business_id: 'business-id',
      product_id: product.id,
      imageFilename: 'image.jpg',
    });

    const imageBusiness = await updateImageProductService.execute({
      business_id: 'business-id',
      product_id: product.id,
      imageFilename: 'image2.jpg',
    });

    expect(imageBusiness).toBe(product);
    expect(deleteFile).toHaveBeenCalledWith('image.jpg');
  });

  it('should be able to update image without business after other update', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const imageProduct = await updateImageProductService.execute({
      business_id: 'business-id',
      imageFilename: 'image2.jpg',
    });

    const imageProductTwo = await updateImageProductService.execute({
      business_id: 'business-id',
      imageFilename: 'image2.jpg',
    });

    expect(imageProductTwo.image).toBe('image2.jpg');
    expect(deleteFile).toHaveBeenCalledWith(imageProduct.image);
  });
});

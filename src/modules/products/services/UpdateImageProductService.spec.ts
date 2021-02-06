import AppError from '@shared/error/AppError';
import FakeStorageProvider from '@shared/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import UpdateImageProductService from './UpdateImageProductService';

let fakeProductRepository: FakeProductRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateImageProductService: UpdateImageProductService;

describe('UpdatedimageBusiness', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateImageProductService = new UpdateImageProductService(
      fakeProductRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update image product', async () => {
    const product = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Description Product',
      label_description: 'description product',
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

  it('should not be able to update image with user incorrect', async () => {
    const product = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Description Product',
      label_description: 'description product',
      provider: 'Coca-cola',
      category: 'drinks',
      internal_code: '100',
      quantity: 10,
      pushase_value: 10.99,
      sale_value: 10.99,
    });

    await expect(
      updateImageProductService.execute({
        business_id: 'business-incorrect',
        product_id: product.id,
        imageFilename: 'image.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update image and removed old image', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const product = await fakeProductRepository.create({
      image: 'image.jpg',
      business_id: 'business-id',
      description: 'Description Product',
      label_description: 'description product',
      provider: 'Coca-cola',
      category: 'drinks',
      internal_code: '100',
      quantity: 10,
      pushase_value: 10.99,
      sale_value: 10.99,
    });

    const imageBusiness = await updateImageProductService.execute({
      business_id: 'business-id',
      product_id: product.id,
      imageFilename: 'image2.jpg',
    });

    expect(imageBusiness).toBe(product);
    expect(deleteFile).toHaveBeenCalledWith('image.jpg');
  });
});

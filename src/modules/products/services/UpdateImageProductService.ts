import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import ICacheProvider from '@shared/provider/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import Product from '../infra/typeorm/entities/Product';
import IProductRepository from '../repositories/IProductRepository';

interface IRequest {
  business_id: string;
  product_id?: string;
  imageFilename: string;
}

@injectable()
class UpdateImageProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    business_id,
    product_id,
    imageFilename,
  }: IRequest): Promise<Product | { image: string }> {
    const product = product_id
      ? await this.productRepository.findById(product_id)
      : undefined;

    if (product_id && !product)
      throw new AppError('Product not found for change image.');

    const image = await this.storageProvider.saveFile(imageFilename);

    const avatarCached = await this.cacheProvider.recover<string>(
      `image-tmp-product:${business_id}`,
    );

    if (avatarCached) await this.storageProvider.deleteFile(avatarCached);

    if (product) {
      if (product.image) await this.storageProvider.deleteFile(product.image);

      product.image = image;
      await this.productRepository.save(product);

      return product;
    }

    await this.cacheProvider.remove(`image-tmp-product:${business_id}`);

    await this.cacheProvider.save(`image-tmp-product:${business_id}`, image);

    return { image };
  }
}

export default UpdateImageProductService;

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import Product from '../infra/typeorm/entities/Product';
import IProductRepository from '../repositories/IProductRepository';

interface IRequest {
  business_id: string;
  product_id: string;
  imageFilename: string;
}

@injectable()
class UpdateImageProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    business_id,
    product_id,
    imageFilename,
  }: IRequest): Promise<Product | { image: string }> {
    const product = await this.productRepository.findById(product_id);

    if (!product) throw new AppError('Product not found for change image.');

    if (product.business_id !== business_id)
      throw new AppError('Business not found for change image');

    const image = await this.storageProvider.saveFile(imageFilename);

    if (product.image) await this.storageProvider.deleteFile(product.image);

    product.image = image;
    await this.productRepository.save(product);

    return product;
  }
}

export default UpdateImageProductService;

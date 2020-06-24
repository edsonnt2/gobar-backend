import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import Product from '../infra/typeorm/entities/Product';
import IProductRepository from '../repositories/IProductRepository';

interface IRequest {
  business_id: string;
  image?: string;
  description: string;
  category: string;
  quantity: number;
  provider: string;
  internal_code: string;
  barcode?: string;
  pushase_value: number;
  porcent?: number;
  sale_value: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    business_id,
    image,
    description,
    category,
    quantity,
    provider,
    internal_code,
    barcode,
    pushase_value,
    porcent,
    sale_value,
  }: IRequest): Promise<Product> {
    const descriptionProduct = await this.productRepository.findInProduct({
      find: description,
      where: 'description',
      business_id,
    });

    if (descriptionProduct) {
      throw new AppError('Description already registered');
    }

    const internalCodeProduct = await this.productRepository.findInProduct({
      find: internal_code,
      where: 'internal_code',
      business_id,
    });

    if (internalCodeProduct) {
      throw new AppError('Internal code already registered');
    }

    if (barcode) {
      const barcodeProduct = await this.productRepository.findInProduct({
        find: barcode,
        where: 'barcode',
        business_id,
      });

      if (barcodeProduct) {
        throw new AppError('Barcode already registered');
      }
    }

    if (image) await this.storageProvider.saveFile(image);

    const product = await this.productRepository.create({
      business_id,
      image,
      description,
      category: category.toLowerCase(),
      quantity,
      provider: provider.toLowerCase(),
      internal_code,
      barcode,
      pushase_value,
      porcent,
      sale_value,
    });

    return product;
  }
}

export default CreateProductService;

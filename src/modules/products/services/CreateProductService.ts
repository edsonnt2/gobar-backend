import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import removeAccents from '@shared/utils/removeAccents';
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

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

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
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const descriptionProduct = await this.productRepository.findInProduct({
      find: description,
      where: 'description',
      business_id,
    });

    if (descriptionProduct) {
      throw new AppError('Description already registered');
    }

    const formatted_internal_code = removeAccents(internal_code)
      .toUpperCase()
      .trim();

    const internalCodeProduct = await this.productRepository.findInProduct({
      find: formatted_internal_code,
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

    const label_description = removeAccents(description).toLowerCase().trim();

    const product = await this.productRepository.create({
      business_id,
      image,
      description,
      label_description,
      category,
      quantity,
      provider,
      internal_code: formatted_internal_code,
      barcode,
      pushase_value,
      porcent,
      sale_value,
    });

    return product;
  }
}

export default CreateProductService;

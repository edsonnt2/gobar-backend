import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import removeAccents from '@shared/utils/removeAccents';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
  business_id: string;
  internal_code: string;
}

@injectable()
class FindProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    internal_code,
  }: IRequest): Promise<Product | undefined> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found.');

    const formatted_internal_code = removeAccents(internal_code)
      .toUpperCase()
      .trim();

    const product = await this.productRepository.findInProduct({
      business_id,
      where: 'internal_code',
      find: formatted_internal_code,
    });

    return product;
  }
}

export default FindProductService;

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
  business_id: string;
  search: string;
}

@injectable()
class SearchProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({ business_id, search }: IRequest): Promise<Product[]> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found.');

    const products = await this.productRepository.search(search, business_id);

    return products;
  }
}

export default SearchProductService;

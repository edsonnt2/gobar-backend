import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ITableRepository from '../repositories/ITableRepository';
import Table from '../infra/typeorm/entities/Table';

interface IRequest {
  business_id: string;
  search: string;
  closed?: boolean;
}

@injectable()
class SearchTableService {
  constructor(
    @inject('TableRepository')
    private tableRepository: ITableRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    search,
    closed,
  }: IRequest): Promise<Table[]> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const tables = await this.tableRepository.search({
      business_id,
      search,
      closed,
    });

    return tables;
  }
}

export default SearchTableService;

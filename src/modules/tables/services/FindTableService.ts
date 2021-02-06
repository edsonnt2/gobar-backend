import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ITableRepository from '../repositories/ITableRepository';
import Table from '../infra/typeorm/entities/Table';

interface IRequest {
  business_id: string;
  number: number;
  closed?: boolean;
}

@injectable()
class ListTableService {
  constructor(
    @inject('TableRepository')
    private tableRepository: ITableRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    number,
    closed,
  }: IRequest): Promise<Table> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const table = await this.tableRepository.findByNumber({
      number,
      business_id,
      closed,
    });

    if (!table) throw new AppError('Table not found at the Business');

    return table;
  }
}

export default ListTableService;

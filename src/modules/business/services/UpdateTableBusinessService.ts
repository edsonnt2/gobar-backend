import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '../repositories/IBusinessRepository';
import Business from '../infra/typeorm/entities/Business';

interface IRequest {
  user_id: string;
  business_id: string;
  table: number;
}

@injectable()
class UpdateTableBusinessService {
  constructor(
    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    user_id,
    business_id,
    table,
  }: IRequest): Promise<Business> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found for update table.');

    if (business.user_id !== user_id)
      throw new AppError('User not found for this business.');

    business.table = table;
    await this.businessRepository.save(business);

    return business;
  }
}

export default UpdateTableBusinessService;

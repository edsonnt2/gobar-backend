import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IEntranceRepository from '../repositories/IEntranceRepository';
import Entrance from '../infra/typeorm/entities/Entrance';

interface IRequest {
  business_id: string;
}

@injectable()
class ListEntranceService {
  constructor(
    @inject('EntranceRepository')
    private entranceRepository: IEntranceRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({ business_id }: IRequest): Promise<Entrance[]> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const entrance = await this.entranceRepository.getAll(business_id);

    return entrance;
  }
}

export default ListEntranceService;

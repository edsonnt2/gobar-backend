import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IEntranceRepository from '../repositories/IEntranceRepository';

interface IRequest {
  id: string;
  business_id: string;
}

@injectable()
class DeleteEntranceService {
  constructor(
    @inject('EntranceRepository')
    private entranceRepository: IEntranceRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({ id, business_id }: IRequest): Promise<void> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const entrance = await this.entranceRepository.findById(id);

    if (!entrance) throw new AppError('Entrance not found');

    if (entrance.business_id !== business_id)
      throw new AppError('Entrance not found at this business');

    await this.entranceRepository.deleteById(id, business_id);
  }
}

export default DeleteEntranceService;
